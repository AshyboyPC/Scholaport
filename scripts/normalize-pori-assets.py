#!/usr/bin/env python3
"""Key and normalize generated full-body Pori renders to one stable frame."""

from __future__ import annotations

import argparse
from pathlib import Path
from statistics import median

from PIL import Image


TARGET_SIZE = (781, 900)


def border_key(image: Image.Image) -> tuple[int, int, int]:
    pixels = image.load()
    width, height = image.size
    samples: list[tuple[int, int, int]] = []
    band = max(2, min(width, height) // 180)
    step = max(1, min(width, height) // 256)
    for x in range(0, width, step):
        for y in range(band):
            samples.append(pixels[x, y][:3])
            samples.append(pixels[x, height - 1 - y][:3])
    for y in range(0, height, step):
        for x in range(band):
            samples.append(pixels[x, y][:3])
            samples.append(pixels[width - 1 - x, y][:3])
    return tuple(int(median(sample[channel] for sample in samples)) for channel in range(3))


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def remove_key(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    key = border_key(image)
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, source_alpha = pixels[x, y]
            distance = max(abs(red - key[0]), abs(green - key[1]), abs(blue - key[2]))
            alpha = int(round(255 * smoothstep((distance - 10) / 88)))
            key_strength = min(red, blue)
            magenta_dominance = key_strength - green
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
                # Remove magenta edge contamination before premultiplied-alpha rendering.
                cap = max(0, green - 1)
                red = min(red, cap)
                blue = min(blue, cap)
            pixels[x, y] = (red, green, blue, alpha)
    return image


def normalize(source: Path, destination: Path, already_transparent: bool) -> None:
    with Image.open(source) as opened:
        image = opened.convert("RGBA")
    if not already_transparent:
        image = remove_key(image)
    alpha_bbox = image.getchannel("A").getbbox()
    if alpha_bbox is None:
        raise ValueError(f"No visible subject found in {source}")
    subject = image.crop(alpha_bbox).resize(TARGET_SIZE, Image.Resampling.LANCZOS)
    destination.parent.mkdir(parents=True, exist_ok=True)
    subject.save(destination, format="PNG", optimize=True)
    print(f"{source.name} -> {destination} ({TARGET_SIZE[0]}x{TARGET_SIZE[1]})")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "asset",
        nargs="+",
        help="SOURCE=DESTINATION entries; prefix SOURCE with alpha: when it is already transparent.",
    )
    args = parser.parse_args()
    for entry in args.asset:
        source_text, destination_text = entry.split("=", 1)
        already_transparent = source_text.startswith("alpha:")
        source = Path(source_text.removeprefix("alpha:"))
        normalize(source, Path(destination_text), already_transparent)


if __name__ == "__main__":
    main()
