from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUT = DATA / "aymp-daily-state.json"
REPORT = ROOT / "automation" / "AYMP-AUTO-STATUS.md"
DRAFTS = DATA / "aymp-growth-drafts.json"
GROWTH_REPORT = ROOT / "automation" / "AYMP-GROWTH-PLAN.md"
TZ = ZoneInfo("Asia/Kolkata")
YOUTUBE_CHANNEL_ID = "UCHn5AYK-Bm6KC2n0YaOlZ0A"


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def day_of_year(dt: datetime) -> int:
    return int(dt.strftime("%j"))


def latest_youtube():
    url = f"https://www.youtube.com/feeds/videos.xml?channel_id={YOUTUBE_CHANNEL_ID}"
    req = Request(url, headers={"User-Agent": "AYMP-AutoGrowth/1.0"})
    try:
        xml = urlopen(req, timeout=15).read().decode("utf-8", errors="replace")
    except Exception as exc:
        return {"status": "unavailable", "reason": str(exc)}

    first = re.search(r"<entry>(.*?)</entry>", xml, re.S)
    if not first:
        return {"status": "no_video"}
    entry = first.group(1)
    title = re.search(r"<title>(.*?)</title>", entry, re.S)
    video_id = re.search(r"<yt:videoId>(.*?)</yt:videoId>", entry, re.S)
    published = re.search(r"<published>(.*?)</published>", entry, re.S)
    return {
        "status": "ok",
        "title": title.group(1).strip() if title else "Latest AYMP video",
        "video_id": video_id.group(1).strip() if video_id else "",
        "published": published.group(1).strip() if published else "",
        "url": f"https://www.youtube.com/watch?v={video_id.group(1).strip()}" if video_id else "",
    }


def build_growth_queue(now: datetime, day_key: str, latest: dict):
    day_number = ((day_of_year(now) - 1) % 50) + 1
    latest_text = "Highlight the newest valid AYMP YouTube item; use a neutral fallback if unavailable."
    if latest.get("status") == "ok":
        latest_text = f"Highlight latest AYMP video: {latest.get('title', 'Latest AYMP video')}."
    return [
        {"section": "Today’s Zodiac", "idea": f"Day {day_number}: invite visitors to open the existing Daily Zodiac experience.", "status": "DRAFT_ONLY", "publish": False},
        {"section": "Global Discovery", "idea": "Prepare a curiosity-led global discovery using an approved source; verify before publication.", "status": "DRAFT_ONLY", "publish": False},
        {"section": "Wellness Tip", "idea": "Prepare one conservative educational wellness tip; no diagnosis, dosage, or treatment claims.", "status": "DRAFT_ONLY", "publish": False},
        {"section": "Food Discovery", "idea": "Prepare one safe, general food-learning prompt using an approved source.", "status": "DRAFT_ONLY", "publish": False},
        {"section": "Latest Video", "idea": latest_text, "status": "DRAFT_ONLY", "publish": False},
        {"section": "Cosmic Challenge", "idea": "Invite visitors to complete one short Cosmic Kingdom action and return tomorrow.", "status": "DRAFT_ONLY", "publish": False},
    ]


def main():
    now = datetime.now(TZ)
    zodiac_path = DATA / "all_zodiac_v1.json"
    zodiac = load_json(zodiac_path)
    day_key = f"Day{((day_of_year(now) - 1) % 50) + 1}"
    zodiac_signs = list(zodiac.keys()) if isinstance(zodiac, dict) else []
    latest = latest_youtube()

    pages = {
        "zodiac": "daily-horoscope.html",
        "guidance": "guides.html",
        "wellness": "fertility-family-wellness-guide.html",
        "global_trending": "global-trending.html",
        "food": "food-discovery.html",
        "ask_aymp": "ask-aymp.html",
        "game": "game-zone.html",
    }
    page_status = {name: {"path": path, "exists": (ROOT / path).exists()} for name, path in pages.items()}

    state = {
        "generated_at": now.isoformat(),
        "timezone": "Asia/Kolkata",
        "engine_version": "1.1-growth-draft",
        "day_of_year": day_of_year(now),
        "zodiac_day": day_key,
        "zodiac_database": {"path": "data/all_zodiac_v1.json", "sign_count": len(zodiac_signs), "status": "read_only"},
        "pages": page_status,
        "latest_youtube": latest,
        "next_phase": [
            "connect approved content-source feeds for global discovery",
            "connect an approved LLM through GitHub Secrets only",
            "keep human review before publishing generated wellness/news copy",
            "add weekly analytics summary",
        ],
    }
    OUT.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    queue = build_growth_queue(now, day_key, latest)
    DRAFTS.write_text(json.dumps({
        "version": "1.0",
        "generated_at": now.isoformat(),
        "mode": "draft-only",
        "publish_allowed": False,
        "human_approval_required": True,
        "existing_content_read_only": True,
        "wallet_secrets_access": False,
        "external_llm_api": False,
        "day_number": ((day_of_year(now) - 1) % 50) + 1,
        "items": queue,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    lines = ["# AYMP Auto Growth — Daily Status", "", f"Generated: `{now.isoformat()}`", f"Zodiac cycle: `{day_key}`", "", "## Website modules"]
    for name, info in page_status.items():
        lines.append(f"- {'✅' if info['exists'] else '⚠️'} `{name}` → `{info['path']}`")
    lines += ["", "## YouTube", f"- Status: `{latest.get('status', 'unknown')}`", f"- Latest: `{latest.get('title', 'n/a')}`", "", "## Safety", "- Existing content files are read-only in this phase.", "- No homepage sections are overwritten by this engine.", "- Generated wellness/news copy requires an approval gate before publication."]
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    growth_lines = ["# AYMP AI Growth Engine v1", "", f"Generated: `{now.isoformat()}`", "", "Draft-only daily growth queue. No website publication is performed.", ""]
    growth_lines += [f"- **{item['section']}** — {item['idea']}" for item in queue]
    growth_lines += ["", "## Safety", "- Existing website and zodiac content remain read-only.", "- Human approval is required before publication.", "- Wallet keys and external API credentials are not accessed.", ""]
    GROWTH_REPORT.write_text("\n".join(growth_lines), encoding="utf-8")


if __name__ == "__main__":
    main()
