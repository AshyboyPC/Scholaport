#!/usr/bin/env python3
"""Build a labeled reference board for Pori's six approved head accessories."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = [
    ("CLOUD CAP", ROOT / "src/assets/pori/head/cloud-cap.png"),
    ("ACADEMIC HEADBAND", ROOT / "src/assets/pori/head/academic-headband.png"),
    ("ROUTE BEANIE", ROOT / "src/assets/pori/head/route-beanie.png"),
    ("TEAL EXPLORER HAT", ROOT / "src/assets/pori/head/explorer-hat.png"),
    ("SMALL HEADPHONES", ROOT / "src/assets/pori/head/headphones.png"),
    ("STUDY VISOR", ROOT / "src/assets/pori/head/study-visor.png"),
]
CELL = 512
board = Image.new("RGB", (CELL * 2, CELL * 3), "white")
draw = ImageDraw.Draw(board)
font = ImageFont.load_default(size=24)

for index, (label, path) in enumerate(ASSETS):
    column = index % 2
    row = index // 2
    left = column * CELL
    top = row * CELL
    with Image.open(path) as opened:
        accessory = opened.convert("RGBA")
    accessory.thumbnail((420, 400), Image.Resampling.LANCZOS)
    x = left + (CELL - accessory.width) // 2
    y = top + 54 + (400 - accessory.height) // 2
    board.paste(accessory, (x, y), accessory)
    draw.text((left + 20, top + 16), f"{index + 1}. {label}", fill="#07113f", font=font)
    draw.rectangle((left, top, left + CELL - 1, top + CELL - 1), outline="#cbd5e1", width=2)

output = ROOT / "src/assets/pori/head/head-accessory-reference.png"
board.save(output, optimize=True)
print(output)
