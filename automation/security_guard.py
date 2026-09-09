from __future__ import annotations

import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ALLOWED = {
    "data/aymp-daily-state.json",
    "automation/AYMP-AUTO-STATUS.md",
    "data/aymp-growth-drafts.json",
    "automation/AYMP-GROWTH-PLAN.md",
}

SECRET_PATTERNS = [
    re.compile(r"-----BEGIN (?:RSA|EC|OPENSSH|DSA|PGP) PRIVATE KEY-----"),
    re.compile(r"(?i)\b(?:seed phrase|recovery phrase|mnemonic)\b\s*[:=]"),
    re.compile(r"(?i)\b(?:private[_ -]?key|api[_ -]?key|secret[_ -]?key|password)\b\s*[:=]\s*[^\s]+"),
]


def changed_files() -> list[str]:
    result = subprocess.run(
        ["git", "diff", "--name-only", "--diff-filter=ACMR", "HEAD"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def scan_file(path: Path) -> list[str]:
    try:
        text = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return []
    return [pattern.pattern for pattern in SECRET_PATTERNS if pattern.search(text)]


def main() -> None:
    if os.getenv("AYMP_AUTOMATION_DISABLED", "false").lower() == "true":
        raise SystemExit("AYMP automation is disabled by emergency stop.")
    files = changed_files()
    unexpected = sorted(set(files) - ALLOWED)
    if unexpected:
        raise SystemExit("SECURITY BLOCK: unexpected modified files: " + ", ".join(unexpected))
    findings = []
    for rel in files:
        findings.extend((rel, item) for item in scan_file(ROOT / rel))
    if findings:
        locations = ", ".join(rel for rel, _ in findings)
        raise SystemExit("SECURITY BLOCK: possible secret material detected in " + locations)
    print("SECURITY OK: changed files are within the automation allow-list and no blocked secret pattern was detected.")


if __name__ == "__main__":
    main()
