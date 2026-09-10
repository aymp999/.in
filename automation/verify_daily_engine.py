from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [
    "data/aymp-daily-state.json",
    "data/aymp-growth-drafts.json",
    "automation/AYMP-AUTO-STATUS.md",
    "automation/AYMP-GROWTH-PLAN.md",
]

def run(script: str) -> None:
    subprocess.run([sys.executable, script], cwd=ROOT, check=True)

def main() -> None:
    run("automation/aymp_daily_engine.py")
    run("automation/security_guard.py")
    for rel in REQUIRED:
        path = ROOT / rel
        if not path.exists():
            raise SystemExit(f"VERIFY FAIL: missing {rel}")
        if path.stat().st_size == 0:
            raise SystemExit(f"VERIFY FAIL: empty {rel}")
    drafts = json.loads((ROOT / "data/aymp-growth-drafts.json").read_text(encoding="utf-8"))
    if drafts.get("publish_allowed") is not False or drafts.get("human_approval_required") is not True:
        raise SystemExit("VERIFY FAIL: approval gate is not enforced")
    if len(drafts.get("items", [])) != 6:
        raise SystemExit("VERIFY FAIL: expected exactly 6 growth draft items")
    print("VERIFY OK: daily engine outputs exist, security guard passed, and approval gate is enforced.")

if __name__ == "__main__":
    main()
