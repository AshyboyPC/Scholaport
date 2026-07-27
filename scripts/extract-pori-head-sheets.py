#!/usr/bin/env python3
"""Split generated Pori head sheets into fixed-frame transparent runtime assets."""

from __future__ import annotations

import argparse
from pathlib import Path
from statistics import median

from PIL import Image


HEAD_ACCESSORIES = [
    "cloud-cap",
    "academic-headband",
    "route-beanie",
    "explorer-hat",
    "headphones",
    "study-visor",
]
EXPRESSIONS = ["friendly", "curious", "focused", "encouraging", "excited", "calm"]
TARGET_SIZE = (781, 900)


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def border_key(image: Image.Image) -> tuple[int, int, int]:
    pixels = image.load()
    samples = []
    for point in [(0, 0), (image.width - 1, 0), (0, image.height - 1), (image.width - 1, image.height - 1)]:
        x, y = point
        for offset_y in range(8):
            for offset_x in range(8):
                sample_x = x + offset_x if x == 0 else x - offset_x
                sample_y = y + offset_y if y == 0 else y - offset_y
                samples.append(pixels[sample_x, sample_y][:3])
    return tuple(int(median(sample[channel] for sample in samples)) for channel in range(3))


def remove_key(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    key = border_key(image)
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, source_alpha = pixels[x, y]
            distance = max(abs(red - key[0]), abs(green - key[1]), abs(blue - key[2]))
            alpha = int(round(255 * smoothstep((distance - 10) / 88)))
            magenta_dominance = min(red, blue) - green
            if magenta_dominance > 16:
                denominator = max(1, max(key) - green)
                dominance_alpha = int(
                    round(255 * (1 - min(1, magenta_dominance / denominator)))
                )
                alpha = min(alpha, dominance_alpha)
            alpha = int(round(alpha * source_alpha / 255))
            if alpha <= 6:
                pixels[x, y] = (0, 0, 0, 0)
                continue
            if magenta_dominance > 16 and alpha < 252:
                cap = max(0, green - 1)
                red = min(red, cap)
                blue = min(blue, cap)
            pixels[x, y] = (red, green, blue, alpha)
    return image


def split_keyed_cells(sheet_path: Path) -> list[Image.Image]:
    with Image.open(sheet_path) as opened:
        sheet = opened.convert("RGBA")
    if sheet.width % 2 or sheet.height % 3:
        raise ValueError(f"Sheet must divide into a 2x3 grid, got {sheet.size} for {sheet_path}")

    cell_width = sheet.width // 2
    cell_height = sheet.height // 3
    cells = []
    for index in range(6):
        column = index % 2
        row = index // 2
        cell = sheet.crop(
            (
                column * cell_width,
                row * cell_height,
                (column + 1) * cell_width,
                (row + 1) * cell_height,
            )
        )
        cells.append(remove_key(cell))
    return cells


def normalize_shared_frame(cells: list[Image.Image]) -> list[Image.Image]:
    boxes = [
        cell.getchannel("A").point(lambda alpha: 255 if alpha >= 32 else 0).getbbox()
        for cell in cells
    ]
    if any(box is None for box in boxes):
        raise ValueError("Every sheet cell must contain one visible Pori")
    visible_boxes = [box for box in boxes if box is not None]
    left = min(box[0] for box in visible_boxes)
    top = min(box[1] for box in visible_boxes)
    right = max(box[2] for box in visible_boxes)
    bottom = max(box[3] for box in visible_boxes)
    padding_x = round(cells[0].width * 0.025)
    padding_y = round(cells[0].height * 0.015)
    shared_box = (
        max(0, left - padding_x),
        max(0, top - padding_y),
        min(cells[0].width, right + padding_x),
        min(cells[0].height, bottom + padding_y),
    )
    normalized = []
    for cell in cells:
        subject = cell.crop(shared_box)
        scale = min((TARGET_SIZE[0] - 12) / subject.width, (TARGET_SIZE[1] - 12) / subject.height)
        resized = subject.resize(
            (round(subject.width * scale), round(subject.height * scale)),
            Image.Resampling.LANCZOS,
        )
        canvas = Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))
        canvas.alpha_composite(
            resized,
            dest=((TARGET_SIZE[0] - resized.width) // 2, (TARGET_SIZE[1] - resized.height) // 2),
        )
        normalized.append(canvas)
    return normalized


def extract(sheet_path: Path, style: str, expression: str, output_root: Path) -> None:
    normalized_cells = normalize_shared_frame(split_keyed_cells(sheet_path))
    for accessory, normalized in zip(HEAD_ACCESSORIES, normalized_cells, strict=True):
        destination = output_root / style / expression / f"{accessory}.png"
        destination.parent.mkdir(parents=True, exist_ok=True)
        normalized.save(destination, format="PNG", optimize=True)
        print(f"{style}/{expression}/{accessory}.png")


def extract_expression_sheet(sheet_path: Path, style: str, output_root: Path) -> None:
    normalized_cells = normalize_shared_frame(split_keyed_cells(sheet_path))
    for expression, normalized in zip(EXPRESSIONS, normalized_cells, strict=True):
        destination = output_root / style / f"{expression}.png"
        destination.parent.mkdir(parents=True, exist_ok=True)
        normalized.save(destination, format="PNG", optimize=True)
        print(f"{style}/{expression}.png")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "sheet",
        nargs="*",
        help="STYLE:EXPRESSION:PATH entries in Classic/Plush expression order.",
    )
    parser.add_argument(
        "--output-root",
        default="src/assets/pori/baked-head",
        type=Path,
    )
    parser.add_argument(
        "--expression-sheet",
        action="append",
        default=[],
        help="STYLE:PATH entries containing all six expressions in row-major order.",
    )
    parser.add_argument(
        "--expression-output-root",
        default="src/assets/pori/full",
        type=Path,
    )
    args = parser.parse_args()
    for spec in args.sheet:
        style, expression, path = spec.split(":", 2)
        extract(Path(path), style, expression, args.output_root)
    for spec in args.expression_sheet:
        style, path = spec.split(":", 1)
        extract_expression_sheet(Path(path), style, args.expression_output_root)


if __name__ == "__main__":
    main()
