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
# Hand-reviewed grille and wheel positions for the remaining 73 Work images.
EMBLEMS.update({
    "public/vehicle-images/2018-audi-q2-in-graphitgrau.webp": [(804, 560, 29), (1212, 696, 13)],
    "public/vehicle-images/2018-seat-ateca-am-hellen-steinplatz.webp": [(826, 558, 26), (1235, 703, 13)],
    "public/vehicle-images/blaue-skoda-octavia-combi-auf-steinplatz.webp": [(820, 558, 24), (1227, 693, 13)],
    "public/vehicle-images/blaue-skoda-scala-auf-hellem-steinplatz.webp": [(815, 570, 28), (1227, 694, 13)],
    "public/vehicle-images/blauer-arteon-auf-hellem-steinplatz.webp": [(824, 591, 27), (1252, 686, 13)],
    "public/vehicle-images/blauer-audi-a1-auf-steinplatz.webp": [(837, 592, 26), (1253, 695, 13)],
    "public/vehicle-images/blauer-audi-a6-avant-auf-steinplatz.webp": [(790, 588, 27), (1236, 692, 13)],
    "public/vehicle-images/blauer-audi-q4-e-tron-auf-steinplatz.webp": [(829, 553, 27), (1238, 693, 13)],
    "public/vehicle-images/blauer-audi-q8-auf-hellem-steinplatz.webp": [(805, 560, 29), (1235, 696, 13)],
    "public/vehicle-images/blauer-audi-tt-vor-heller-steinmauer.webp": [(808, 591, 27), (1258, 700, 13)],
    "public/vehicle-images/blauer-golf-plus-auf-hellem-steinplatz.webp": [(820, 568, 28), (1239, 708, 13)],
    "public/vehicle-images/blauer-skoda-rapid-am-steinplatz.webp": [(825, 558, 24), (1241, 712, 13)],
    "public/vehicle-images/blauer-touareg-auf-hellem-steinplatz.webp": [(803, 531, 27), (1227, 702, 13)],
    "public/vehicle-images/dunkelrote-skoda-octavia-ii-combi.webp": [(821, 558, 23), (1244, 711, 13)],
    "public/vehicle-images/dunkelroter-audi-a3-sportback.webp": [(819, 592, 27), (1244, 706, 13)],
    "public/vehicle-images/dunkelroter-audi-a6-avant-auf-hellem-steinplatz.webp": [(826, 586, 27), (1256, 694, 13)],
    "public/vehicle-images/dunkelroter-audi-a8-auf-hellem-steinplatz.webp": [(779, 582, 25), (1232, 687, 13)],
    "public/vehicle-images/dunkelroter-audi-q3-auf-hellem-steinplatz.webp": [(826, 583, 28), (1245, 703, 13)],
    "public/vehicle-images/dunkelroter-audi-q5-auf-hellem-steinplatz.webp": [(806, 562, 26), (1224, 690, 13)],
    "public/vehicle-images/dunkelroter-golf-vi-auf-steinplatz.webp": [(842, 577, 26), (1265, 697, 13)],
    "public/vehicle-images/dunkelroter-id-3-auf-dem-steinplatz.webp": [(860, 562, 28), (1256, 695, 13)],
    "public/vehicle-images/dunkelroter-passat-variant-auf-dem-steinplatz.webp": [(808, 585, 26), (1232, 695, 13)],
    "public/vehicle-images/dunkelroter-skoda-yeti-auf-hellem-steinplatz.webp": [(836, 524, 29), (1232, 698, 13)],
    "public/vehicle-images/dunkelroter-tiguan-auf-hellem-steinplatz.webp": [(826, 563, 28), (1237, 709, 13)],
    "public/vehicle-images/dunkelroter-volkswagen-transporter-t5-im-sonnenlicht.webp": [(820, 533, 28), (1212, 711, 13)],
    "public/vehicle-images/dunkelrotes-audi-a5-coupe-auf-steinplatz.webp": [(819, 593, 27), (1252, 693, 13)],
    "public/vehicle-images/graphitgraue-skoda-fabia-auf-hellem-steinplatz.webp": [(825, 560, 23), (1216, 725, 13)],
    "public/vehicle-images/graphitgrauer-audi-a3-auf-hellem-steinplatz.webp": [(824, 589, 27), (1250, 699, 13)],
    "public/vehicle-images/graphitgrauer-audi-a4-avant.webp": [(804, 586, 28), (1237, 691, 13)],
    "public/vehicle-images/graphitgrauer-audi-a5-sportback.webp": [(795, 584, 28), (1238, 692, 13)],
    "public/vehicle-images/graphitgrauer-audi-a8-d4-vor-steinmauer.webp": [(808, 576, 28), (1254, 691, 13)],
    "public/vehicle-images/graphitgrauer-audi-q7-auf-steinplatz.webp": [(800, 562, 28), (1234, 710, 13)],
    "public/vehicle-images/graphitgrauer-golf-vii-auf-hellem-steinplatz.webp": [(845, 579, 29), (1266, 697, 13)],
    "public/vehicle-images/graphitgrauer-id-4-auf-hellem-steinplatz.webp": [(845, 539, 28), (1251, 695, 13)],
    "public/vehicle-images/graphitgrauer-passat-b9-auf-steinplatz.webp": [(810, 574, 29), (1234, 693, 13)],
    "public/vehicle-images/graphitgrauer-polo-v-auf-steinplatz.webp": [(847, 581, 29), (1249, 706, 13)],
    "public/vehicle-images/graphitgrauer-skoda-kodiaq-auf-hellem-steinplatz.webp": [(830, 531, 26), (1222, 701, 13)],
    "public/vehicle-images/graphitgrauer-t6-multivan-auf-steinplatz.webp": [(828, 543, 29), (1205, 712, 13)],
    "public/vehicle-images/graphitgrauer-volkswagen-touran-auf-steinplatz.webp": [(833, 574, 28), (1238, 719, 13)],
    "public/vehicle-images/metallgrauer-audi-a7-vor-heller-steinmauer.webp": [(794, 600, 29), (1240, 695, 13)],
    "public/vehicle-images/metallisch-roter-seat-leon-auf-steinplatz.webp": [(846, 582, 25), (1257, 693, 13)],
    "public/vehicle-images/neuer-volkswagen-tayron-in-tiefem-metallicblau.webp": [(810, 544, 27), (1240, 693, 13)],
    "public/vehicle-images/originaler-2021-cupra-formentor-in-petrolblau.webp": [(813, 574, 22), (1237, 706, 12)],
    "public/vehicle-images/perlweier-audi-a1-auf-steinplatz.webp": [(835, 590, 28), (1247, 697, 13)],
    "public/vehicle-images/perlweier-audi-a6-avant-im-tageslicht.webp": [(818, 587, 28), (1259, 694, 13)],
    "public/vehicle-images/perlweier-audi-q6-e-tron-auf-hellem-steinplatz.webp": [(837, 558, 27), (1249, 692, 13)],
    "public/vehicle-images/perlweier-audi-tt-auf-hellem-steinplatz.webp": [(837, 594, 26), (1273, 692, 13)],
    "public/vehicle-images/perlweier-golf-v-auf-steinplatz.webp": [(853, 569, 28), (1267, 695, 13)],
    "public/vehicle-images/perlweier-passat-variant-auf-sonnigem-steinplatz.webp": [(797, 582, 29), (1238, 695, 13)],
    "public/vehicle-images/perlweier-skoda-rapid-am-steinplatz.webp": [(822, 567, 24), (1238, 713, 13)],
    "public/vehicle-images/perlweier-touareg-auf-hellem-steinplatz.webp": [(824, 541, 27), (1233, 697, 13)],
    "public/vehicle-images/perlweier-volkswagen-up-auf-hellem-steinplatz.webp": [(875, 563, 29), (1230, 718, 13)],
    "public/vehicle-images/perlweier-vw-tiguan-der-ersten-generation.webp": [(806, 557, 28), (1231, 706, 13)],
    "public/vehicle-images/petrolblauer-cupra-formentor-auf-steinplatz.webp": [(809, 570, 24), (1234, 696, 12)],
    "public/vehicle-images/roter-skoda-superb-kombi-im-sonnenlicht.webp": [(819, 559, 23), (1223, 692, 13)],
    "public/vehicle-images/silberner-audi-a3-sportback-am-steinplatz.webp": [(836, 588, 28), (1261, 697, 13)],
    "public/vehicle-images/silberner-audi-a5-avant-am-steinplatz.webp": [(781, 597, 26), (1230, 695, 13)],
    "public/vehicle-images/silberner-audi-a7-sportback-am-steinplatz.webp": [(804, 604, 28), (1245, 693, 13)],
    "public/vehicle-images/silberner-audi-a8-auf-hellem-steinplatz.webp": [(815, 584, 28), (1252, 684, 13)],
    "public/vehicle-images/silberner-audi-q3-vor-heller-steinmauer.webp": [(827, 570, 28), (1248, 697, 13)],
    "public/vehicle-images/silberner-audi-q7-vor-heller-steinwand.webp": [(803, 548, 26), (1234, 704, 13)],
    "public/vehicle-images/silberner-id-5-am-hellen-steinplatz.webp": [(823, 550, 27), (1231, 690, 13)],
    "public/vehicle-images/silberner-multivan-vor-heller-steinwand.webp": [(828, 551, 29), (1240, 723, 13)],
    "public/vehicle-images/silberner-polo-auf-hellem-steinplatz.webp": [(847, 580, 28), (1259, 696, 13)],
    "public/vehicle-images/silberner-skoda-karoq-auf-hellem-steinplatz.webp": [(846, 524, 25), (1253, 702, 13)],
    "public/vehicle-images/silberner-skoda-octavia-combi-auf-steinplatz.webp": [(826, 569, 24), (1234, 711, 13)],
    "public/vehicle-images/silberner-skoda-octavia-kombi-auf-steinplatz.webp": [(811, 548, 19), (1203, 708, 13)],
    "public/vehicle-images/silberner-touran-vor-heller-steinmauer.webp": [(789, 572, 28), (1186, 709, 13)],
    "public/vehicle-images/skoda-superb-ii-combi-auf-dem-steinplatz.webp": [(839, 556, 28), (1248, 695, 13)],
    "public/vehicle-images/tiefblauer-audi-a4-avant-am-steinplatz.webp": [(807, 590, 27), (1232, 692, 13)],
    "public/vehicle-images/tiefblauer-audi-q5-auf-hellem-steinplatz.webp": [(822, 554, 25), (1235, 696, 13)],
    "public/vehicle-images/weier-audi-e-tron-auf-hellem-steinplatz.webp": [(817, 557, 27), (1231, 685, 13)],
    "public/vehicle-images/weier-audi-q5-auf-dem-steinplatz.webp": [(797, 567, 27), (1218, 706, 13)],
})

EMBLEMS.update({
    "public/td-hero-natural.webp": [(850, 575, 31), (1266, 694, 13), (1555, 680, 9)],
    "public/td-hero-performance.webp": [(762, 594, 27), (1231, 701, 13), (1575, 703, 9)],
})

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
    if path.name != "td-hero-performance.webp" and abs(width / height - REFERENCE_WIDTH / REFERENCE_HEIGHT) > 0.08:
        raise ValueError(f"Unexpected aspect ratio: {path}: {width}x{height}")
    factor_x, factor_y = width / REFERENCE_WIDTH, height / REFERENCE_HEIGHT
    for x, y, radius in points:
        draw_badge(image, round(x*factor_x), round(y*factor_y),
                   round(radius * min(factor_x, factor_y)))
    image.convert("RGB").save(path, "WEBP", quality=93, method=6)
    print(f"Corrected {path} ({width}x{height}; {len(points)} badges)")


def main() -> None:
    import json
    import subprocess

    marker = Path(".td-emblems-processed.json")
    already_done = {
        "public/td-hero-chrome.webp",
        "public/td-hero-gti-red.webp",
        "public/td-hero-r-blue.webp",
        "public/td-vehicle-audi-a4-b9.webp",
        "public/td-vehicle-octavia-5e.webp",
        "public/td-vehicle-cupra-formentor.webp",
        "public/td-vehicle-seat-leon-5f.webp",
        "public/vehicle-images/blauer-passat-variant-auf-dem-steinplatz.webp",
    }
    if marker.exists():
        already_done.update(json.loads(marker.read_text(encoding="utf-8")))

    for name, points in EMBLEMS.items():
        if name in already_done:
            print(f"Already corrected, skipping {name}")
            continue
        path = Path(name)
        if not path.is_file():
            raise FileNotFoundError(f"Missing original image: {path}")
        process(path, points)
        already_done.add(name)

    marker.write_text(json.dumps(sorted(already_done), ensure_ascii=False, indent=2) + "\n",
                      encoding="utf-8")
    # The existing CI commit step will commit all staged changes together.
    subprocess.run(["git", "add", "-u", "public"], check=True)
    subprocess.run(["git", "add", str(marker)], check=True)


if __name__ == "__main__":
    main()
