#!/usr/bin/env python3
"""Build a labeled reference board for Pori's six approved expressions."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "src/assets/pori"
EXPRESSIONS = [
    ("FRIENDLY", ASSET_ROOT / "full/classic/friendly.png"),
    ("CURIOUS", ASSET_ROOT / "expressions/curious.png"),
    ("FOCUSED", ASSET_ROOT / "expressions/focused.png"),
    ("ENCOURAGING", ASSET_ROOT / "expressions/encouraging.png"),
    ("EXCITED", ASSET_ROOT / "expressions/excited.png"),
    ("CALM", ASSET_ROOT / "expressions/calm.png"),
]
CELL = 512
board = Image.new("RGB", (CELL * 2, CELL * 3), "white")
draw = ImageDraw.Draw(board)
font = ImageFont.load_default(size=24)

for index, (label, path) in enumerate(EXPRESSIONS):
    column = index % 2
    row = index // 2
    left = column * CELL
    top = row * CELL
    with Image.open(path) as opened:
        expression = opened.convert("RGBA")
    if label == "FRIENDLY":
        expression = expression.crop((90, 0, expression.width - 90, round(expression.height * 0.58)))
    expression.thumbnail((390, 390), Image.Resampling.LANCZOS)
    x = left + (CELL - expression.width) // 2
    y = top + 60 + (390 - expression.height) // 2
    board.paste(expression, (x, y), expression)
    draw.text((left + 20, top + 16), f"{index + 1}. {label}", fill="#07113f", font=font)
    draw.rectangle((left, top, left + CELL - 1, top + CELL - 1), outline="#cbd5e1", width=2)

output = ASSET_ROOT / "expressions/expression-reference.png"
board.save(output, optimize=True)
print(output)
