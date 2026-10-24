"""
note.com「Kim23 Test Laboratory」のマガジン一覧を公開 API から取得し、
各マガジンのカバー画像を public/images/note-mag/<key>.webp に保存する。
マガジン名 → 画像の対応は src/lib/noteMagazineCovers.json に書き出す
(src/lib/magazineImages.ts が参照する)。

カバー未設定 (note の既定ヘッダー) のマガジンは対象外にする。
再実行すると、取得済みの画像はダウンロードし直さない。

Usage:
    python scripts/fetch_note_magazine_covers.py
Requires:
    pip install pillow
"""

import io
import json
import time
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

CREATOR = "labratory_ktech"
API = f"https://note.com/api/v2/creators/{CREATOR}/contents?kind=magazine&page={{page}}"

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images" / "note-mag"
INDEX = ROOT / "src" / "lib" / "noteMagazineCovers.json"

THUMB_SIZE = (640, 400)
# note 側に負荷をかけないよう、リクエストの間隔をあける
WAIT_SEC = 1.0


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "kim23-lab-index cover fetcher"})
    with urllib.request.urlopen(req, timeout=30) as res:
        return res.read()


def magazines() -> list[dict]:
    result: list[dict] = []
    page = 1
    while True:
        data = json.loads(fetch(API.format(page=page)))["data"]
        result += data["contents"]
        if data["isLastPage"]:
            return result
        page += 1
        time.sleep(WAIT_SEC)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    index: dict[str, str] = {}
    for m in magazines():
        cover = m.get("coverRectangle") or m.get("cover") or ""
        if "/uploads/images/" not in cover:
            continue  # カバー未設定
        dest = OUT / f"{m['key']}.webp"
        if not dest.exists():
            im = ImageOps.exif_transpose(Image.open(io.BytesIO(fetch(cover)))).convert("RGB")
            ImageOps.fit(im, THUMB_SIZE, Image.LANCZOS).save(dest, "WEBP", quality=78, method=6)
            time.sleep(WAIT_SEC)
        index[m["name"].strip()] = m["key"]
        print(f"{m['key']}  {m['name']}")
    INDEX.write_text(json.dumps(index, ensure_ascii=False, indent="\t") + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
