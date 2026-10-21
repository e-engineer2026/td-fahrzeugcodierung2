#!/usr/bin/env python3
"""Replace ambiguous TP-looking emblems with readable TD badges.

Only images with visually checked coordinates are processed. Original source
files remain recoverable from git history. Coordinates use a 1670x939 reference.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

REFERENCE_WIDTH, REFERENCE_HEIGHT = 1670, 939
# Front grille emblem; near front wheel hub. x/y/radius in reference pixels.
EMBLEMS = {
    "public/td-hero-chrome.webp": [(850, 575, 31), (1266, 694, 13)],
    "public/td-hero-gti-red.webp": [(850, 575, 31), (1266, 694, 13)],
    "public/td-hero-r-blue.webp": [(850, 575, 31), (1266, 694, 13)],
    "public/td-vehicle-audi-a4-b9.webp": [(808, 584, 28), (1237, 696, 13)],
    "public/td-vehicle-octavia-5e.webp": [(814, 551, 21), (1201, 707, 13)],
    "public/td-vehicle-cupra-formentor.webp": [(814, 578, 22), (1240, 706, 12)],
    "public/td-vehicle-seat-leon-5f.webp": [(850, 585, 24), (1262, 694, 13)],
    "public/vehicle-images/blauer-passat-variant-auf-dem-steinplatz.webp": [(805, 584, 26), (1231, 702, 13)],
}
FONT_PATHS = (
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
)


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in FONT_PATHS:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_badge(image: Image.Image, center_x: int, center_y: int, radius: int) -> None:
    """Draw a crisp metallic black round badge without covering car bodywork."""
    scale = 4
    r = max(8, radius)
    d = (2 * r + 4) * scale
    layer = Image.new("RGBA", (d, d), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    middle = d // 2
    outer = r * scale
    def ring(inset: int, color: tuple[int, ...]) -> None:
        v = outer - inset * scale
        draw.ellipse((middle-v, middle-v, middle+v, middle+v), fill=color)

    ring(0, (40, 47, 57, 242))
    ring(1, (209, 221, 230, 255))
    ring(3, (85, 104, 120, 255))
    ring(4, (12, 18, 29, 255))
    draw.arc((middle-outer+2*scale, middle-outer+2*scale,
              middle+outer-2*scale, middle+outer-2*scale),
             start=194, end=330, fill=(250, 252, 254, 200), width=scale)

    face = "TD"
    size = max(8, round(r * 0.84)) * scale
    f = font(size)
    bounds = draw.textbbox((0, 0), face, font=f, stroke_width=0)
    w, h = bounds[2]-bounds[0], bounds[3]-bounds[1]
    tx = middle - w//2 - bounds[0]
    ty = middle - h//2 - bounds[1]
    stroke = max(1, round(scale * (0.45 if r < 16 else 0.6)))
    draw.text((tx+scale//3, ty+scale//3), face, font=f, fill=(11, 16, 22, 255),
              stroke_width=stroke+1, stroke_fill=(8, 11, 15, 255))
    draw.text((tx, ty), face, font=f, fill=(237, 243, 246, 255),
              stroke_width=stroke, stroke_fill=(63, 78, 91, 255))

    tile = layer.resize((2*r+4, 2*r+4), Image.Resampling.LANCZOS)
    image.alpha_composite(tile, (round(center_x-r-2), round(center_y-r-2)))


def process(path: Path, points: list[tuple[int, int, int]]) -> None:
    with Image.open(path) as original:
        image = original.convert("RGBA")
        width, height = image.size
    if abs(width / height - REFERENCE_WIDTH / REFERENCE_HEIGHT) > 0.08:
        raise ValueError(f"Unexpected aspect ratio: {path}: {width}x{height}")
    factor_x, factor_y = width / REFERENCE_WIDTH, height / REFERENCE_HEIGHT
    for x, y, radius in points:
        draw_badge(image, round(x*factor_x), round(y*factor_y),
                   round(radius * min(factor_x, factor_y)))
    image.convert("RGB").save(path, "WEBP", quality=93, method=6)
    print(f"Corrected {path} ({width}x{height}; {len(points)} badges)")


def main() -> None:
    for name, points in EMBLEMS.items():
        path = Path(name)
        if not path.is_file():
            raise FileNotFoundError(f"Missing original image: {path}")
        process(path, points)


if __name__ == "__main__":
    main()
