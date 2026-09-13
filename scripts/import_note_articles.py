"""
data/note_articles_metadata.xlsx (note.com「Kim23 Test Laboratory」の記事メタデータ) を読み込み、
content/articles/note/ 配下に front matter 付き Markdown スタブを生成する。

各生成ファイルは note.com 側の記事へのメタデータ・リンクインデックスであり、
本文そのものはコピーしない（本文は note.com 側にのみ存在する）。

再実行すると content/articles/note/ を作り直すので、このフォルダを手動編集しないこと。
手動で書く記事は content/articles/ 直下（note/ の外）に置く。

Usage:
    python scripts/import_note_articles.py
Requires:
    pip install openpyxl
"""

import json
import re
import shutil
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
XLSX_PATH = ROOT / "data" / "note_articles_metadata.xlsx"
SHEET_NAME = "記事メタデータ"
OUT_DIR = ROOT / "content" / "articles" / "note"


def yaml_str(value: str) -> str:
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def yaml_str_list(values: list[str]) -> str:
    if not values:
        return " []"
    items = "\n".join(f"  - {yaml_str(v)}" for v in values)
    return f"\n{items}"


def split_multi(raw, sep: str) -> list[str]:
    if not raw:
        return []
    parts = [p.strip() for p in str(raw).split(sep)]
    seen = []
    for p in parts:
        if p and p not in seen:
            seen.append(p)
    return seen


def split_tags(raw) -> list[str]:
    if not raw:
        return []
    tokens = str(raw).split()
    seen = []
    for t in tokens:
        t = t.lstrip("#").strip()
        if t and t not in seen:
            seen.append(t)
    return seen


def build_front_matter(d: dict) -> str:
    lines = ["---"]
    lines.append(f"title: {yaml_str(str(d['title']))}")
    if d.get("date"):
        lines.append(f"date: {d['date']}")
    if d.get("purpose"):
        lines.append(f"summary: {yaml_str(str(d['purpose']))}")

    magazines = split_multi(d.get("magazines"), "/")
    lines.append(f"magazine:{yaml_str_list(magazines)}")

    tags = split_tags(d.get("tags"))
    lines.append(f"tags:{yaml_str_list(tags)}")

    if d.get("category"):
        lines.append(f"category: {yaml_str(str(d['category']))}")
    if d.get("step"):
        lines.append(f"step: {yaml_str(str(d['step']))}")
    if d.get("car"):
        lines.append(f"car_model: {yaml_str(str(d['car']))}")

    ecus = split_multi(d.get("ecu"), "/")
    lines.append(f"ecu:{yaml_str_list(ecus)}")

    price = d.get("price") or 0
    lines.append(f"price: {int(price)}")

    if d.get("note_url"):
        lines.append(f"note_url: {yaml_str(str(d['note_url']))}")

    related = split_multi(d.get("related"), ",")
    lines.append(f"related:{yaml_str_list(related)}")

    lines.append("---")
    return "\n".join(lines)


def build_body(d: dict) -> str:
    title = str(d["title"])
    summary = str(d.get("purpose") or "")
    note_url = str(d.get("note_url") or "")
    parts = [
        "この記事は note.com「Kim23 Test Laboratory」で公開されている記事のメタデータ索引です。",
        "",
    ]
    if summary:
        parts += ["## 概要", "", summary, ""]
    if note_url:
        parts += ["## 全文を読む", "", "本文は note.com 側でご覧いただけます。", "", f"→ [{title}（note.com）]({note_url})", ""]
    return "\n".join(parts)


def main():
    wb = openpyxl.load_workbook(XLSX_PATH, data_only=True)
    ws = wb[SHEET_NAME]
    rows = list(ws.iter_rows(values_only=True))
    header = rows[0]
    data_rows = rows[1:]

    if OUT_DIR.exists():
        shutil.rmtree(OUT_DIR)
    OUT_DIR.mkdir(parents=True)

    written = 0
    slugs = set()
    for r in data_rows:
        d = dict(zip(header, r))
        slug = d.get("slug")
        if not slug:
            continue
        slug = str(slug).strip()
        if not re.match(r"^[a-zA-Z0-9_-]+$", slug):
            print(f"skip unsafe slug: {slug!r}")
            continue
        if slug in slugs:
            print(f"skip duplicate slug: {slug!r}")
            continue
        slugs.add(slug)

        front_matter = build_front_matter(d)
        body = build_body(d)
        content = f"{front_matter}\n\n{body}\n"

        out_path = OUT_DIR / f"{slug}.md"
        out_path.write_text(content, encoding="utf-8")
        written += 1

    print(f"wrote {written} article stub(s) to {OUT_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
