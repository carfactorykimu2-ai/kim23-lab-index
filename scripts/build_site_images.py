"""
手元の写真フォルダ (OneDrive の「フルコン」) からサイト用画像を生成し、public/images/ に書き出す。

- WebP に変換して縮小する (ヒーロー: 1600x600, マガジンのサムネイル: 640x400)
- EXIF (撮影位置などのメタデータ) は書き出し時にすべて削除する
- BLUR に指定した範囲 (シリアル番号のラベルなど) はぼかす

使う写真を変えたいときは IMAGES を編集して再実行する。
キーは src/lib/magazineImages.ts から参照されるファイル名になる。

Usage:
    python scripts/build_site_images.py
Requires:
    pip install pillow
"""

from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

PHOTOS = Path.home() / "OneDrive" / "画像" / "写真"
SRC = PHOTOS / "フルコン"
OUT = Path(__file__).resolve().parent.parent / "public" / "images"

HERO_SIZE = (1600, 600)
THUMB_SIZE = (640, 400)

# 出力名: (元ファイル (SRC からの相対、"../" で PHOTOS 直下の別フォルダ), サイズ, 切り出し中心 (0〜1, 0〜1))
IMAGES = {
    "hero/link-g4-board": ("LINK G4/DSC_4338.JPG", HERO_SIZE, (0.5, 0.45)),
    "mag/link-g4": ("LINK G4/DSC_4614.JPG", THUMB_SIZE, (0.5, 0.5)),
    "mag/ecu-case": ("M1200/DSC_2434.JPG", THUMB_SIZE, (0.5, 0.5)),
    "mag/harness": ("M1200/DSC_3697 (3).JPG", THUMB_SIZE, (0.5, 0.5)),
    "mag/maxxecu": ("Maxxecu/IMG00196 (2).jpg", THUMB_SIZE, (0.5, 0.5)),
    "mag/ecumaster-pmu": ("ECUmaster PMU/IMG00239_HDR.jpg", THUMB_SIZE, (0.5, 0.5)),
    "mag/motec-dash": ("motec/IMG00099_HDR.jpg", THUMB_SIZE, (0.5, 0.5)),
    "mag/injector": ("INJECTOR/IMG00336.jpg", THUMB_SIZE, (0.5, 0.5)),
    "mag/coil": ("coil/DSC_2324.JPG", THUMB_SIZE, (0.5, 0.5)),
    "mag/sensor": ("sensor/IMG00067_HDR.jpg", THUMB_SIZE, (0.5, 0.5)),
    "mag/afr-gauge": ("空燃比計/DSC_1492.JPG", THUMB_SIZE, (0.5, 0.5)),
    # 車両の写真はナンバープレートが写っていないものを選んでいる
    "mag/altoworks": ("../ワークス/DSC_1837.JPG", THUMB_SIZE, (0.45, 0.6)),
    "mag/k6a-engine": ("../ワークス/1595588999162.jpg", THUMB_SIZE, (0.5, 0.4)),
    "mag/sonica": ("../ソニカ/IMG00726.jpg", THUMB_SIZE, (0.5, 0.55)),
    "mag/esse": ("../esse/IMG00153_HDR (2).jpg", THUMB_SIZE, (0.5, 0.5)),
}

# 元画像 (回転補正後) の座標で指定するぼかし範囲: (left, top, right, bottom)
BLUR = {
    "hero/link-g4-board": [(780, 980, 1330, 1420)],
}


def build(name: str, src: str, size: tuple[int, int], centering: tuple[float, float]) -> Path:
    im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
    for box in BLUR.get(name, []):
        im.paste(im.crop(box).filter(ImageFilter.GaussianBlur(24)), box[:2])
    im = ImageOps.fit(im, size, Image.LANCZOS, centering=centering)
    dest = OUT / f"{name}.webp"
    dest.parent.mkdir(parents=True, exist_ok=True)
    # exif を渡さないので、書き出したファイルにメタデータは残らない
    im.save(dest, "WEBP", quality=78, method=6)
    return dest


def main() -> None:
    for name, (src, size, centering) in IMAGES.items():
        dest = build(name, src, size, centering)
        print(f"{dest.relative_to(OUT.parent.parent)}  {dest.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
