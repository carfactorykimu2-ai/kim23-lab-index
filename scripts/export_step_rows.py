"""
Note記事一覧.xlsx の「一覧」シートから STEP行（STEP番号・タイトル・分類）を
src/data/step-rows.json に書き出す。/steps/ ページの行ラベルに使う。

STEP番号のない行（CANの派生行など）と「空き番」行は除外する。
Usage:
    python scripts/export_step_rows.py
"""

import json
import re
import unicodedata
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
XLSX_PATH = ROOT / "Note記事一覧.xlsx"
OUT_PATH = ROOT / "src" / "data" / "step-rows.json"


def norm_step(value) -> str | None:
    if value is None:
        return None
    s = unicodedata.normalize("NFKC", str(value)).strip()
    s = re.sub(r"[‐-―−ー－]", "-", s).replace(" ", "")
    return s if re.fullmatch(r"\d+(-\d+)*", s) else None


def clean(value) -> str:
    return unicodedata.normalize("NFKC", str(value or "")).strip()


def main():
    ws = openpyxl.load_workbook(XLSX_PATH, data_only=True)["一覧"]
    rows = []
    seen = set()
    for r in range(3, ws.max_row + 1):
        step = norm_step(ws.cell(row=r, column=2).value)
        title = clean(ws.cell(row=r, column=3).value)
        if not step or not title or step in seen or title.startswith("空き番"):
            continue
        seen.add(step)
        rows.append({"step": step, "title": title, "category": clean(ws.cell(row=r, column=4).value)})

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(rows, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {len(rows)} step row(s) to {OUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
