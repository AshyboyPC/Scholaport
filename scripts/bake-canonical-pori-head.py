#!/usr/bin/env python3
"""Bake fitted generated headwear onto the canonical Pori expression pixels."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ACCESSORIES = [
    "cloud-cap",
    "academic-headband",
    "route-beanie",
    "explorer-hat",
    "headphones",
    "study-visor",
]


def visible_bbox(image: Image.Image, lower_from: int = 0) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A").point(lambda value: 255 if value >= 32 else 0)
    if lower_from:
        alpha.paste(0, (0, 0, alpha.width, lower_from))
    box = alpha.getbbox()
    if box is None:
        raise ValueError("Expected a visible Pori subject")
    return box


def align_to_canonical(
    generated: Image.Image,
    canonical: Image.Image,
    accessory: str,
) -> Image.Image:
    width, height = canonical.size
    lower_from = round(height * 0.46)
    canonical_box = visible_bbox(canonical, lower_from)
    generated_box = visible_bbox(generated, lower_from)
    full_box = visible_bbox(generated)
    canonical_width = canonical_box[2] - canonical_box[0]
    generated_width = generated_box[2] - generated_box[0]
    width_scale = canonical_width / generated_width
    fit_scale = (canonical_box[3] - 8) / (generated_box[3] - full_box[1])
    scale = min(width_scale, fit_scale)
    plush_tall_hat = visible_bbox(canonical)[1] < 20 and accessory in {
        "cloud-cap",
        "route-beanie",
        "explorer-hat",
    }
    if plush_tall_hat:
        scale *= {
            "cloud-cap": 0.86,
            "route-beanie": 0.84,
            "explorer-hat": 0.9,
        }[accessory]
    resized = generated.resize(
        (round(width * scale), round(height * scale)),
        Image.Resampling.LANCZOS,
    )
    scaled_box = tuple(round(value * scale) for value in generated_box)
    canonical_center = (canonical_box[0] + canonical_box[2]) / 2
    generated_center = (scaled_box[0] + scaled_box[2]) / 2
    offset_x = round(canonical_center - generated_center)
    offset_y = (
        8 - round(full_box[1] * scale)
        if plush_tall_hat
        else canonical_box[3] - scaled_box[3]
    )
    aligned = Image.new("RGBA", canonical.size, (0, 0, 0, 0))
    aligned.alpha_composite(resized, dest=(offset_x, offset_y))
    return aligned


def accessory_mask(size: tuple[int, int], accessory: str) -> Image.Image:
    width, height = size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)

    def box(left: float, top: float, right: float, bottom: float) -> None:
        draw.rounded_rectangle(
            (round(width * left), round(height * top), round(width * right), round(height * bottom)),
            radius=round(width * 0.08),
            fill=255,
        )

    if accessory == "cloud-cap":
        box(0.08, 0.0, 0.92, 0.31)
        draw.ellipse((width * 0.24, height * 0.22, width * 0.76, height * 0.57), fill=0)
    elif accessory == "academic-headband":
        box(0.1, 0.0, 0.9, 0.26)
        draw.ellipse((width * 0.23, height * 0.2, width * 0.77, height * 0.56), fill=0)
    elif accessory == "route-beanie":
        box(0.08, 0.0, 0.92, 0.34)
        draw.ellipse((width * 0.23, height * 0.28, width * 0.77, height * 0.58), fill=0)
    elif accessory == "explorer-hat":
        box(0.01, 0.0, 0.99, 0.37)
        draw.ellipse((width * 0.22, height * 0.31, width * 0.78, height * 0.6), fill=0)
    elif accessory == "headphones":
        box(0.1, 0.0, 0.9, 0.3)
        box(0.03, 0.13, 0.34, 0.48)
        box(0.66, 0.13, 0.97, 0.48)
        draw.ellipse((width * 0.22, height * 0.18, width * 0.78, height * 0.6), fill=0)
    elif accessory == "study-visor":
        box(0.05, 0.03, 0.95, 0.38)
        draw.ellipse((width * 0.22, height * 0.35, width * 0.78, height * 0.62), fill=0)
    else:
        raise ValueError(f"Unknown accessory: {accessory}")

    return mask.filter(ImageFilter.GaussianBlur(radius=1.2))


def identity_mask(size: tuple[int, int], accessory: str) -> Image.Image:
    width, height = size
    start = {
        "cloud-cap": 0.2,
        "academic-headband": 0.2,
        "route-beanie": 0.2,
        "explorer-hat": 0.24,
        "headphones": 0.17,
        "study-visor": 0.23,
    }[accessory]
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).ellipse(
        (width * 0.17, height * start, width * 0.83, height * 0.61),
        fill=255,
    )
    return mask.filter(ImageFilter.GaussianBlur(radius=1.0))


def bake(canonical_path: Path, generated_path: Path, destination: Path, accessory: str) -> None:
    canonical = Image.open(canonical_path).convert("RGBA")
    generated = Image.open(generated_path).convert("RGBA")
    aligned = align_to_canonical(generated, canonical, accessory)
    mask = accessory_mask(canonical.size, accessory)
    mask = Image.composite(aligned.getchannel("A"), Image.new("L", canonical.size, 0), mask)
    overlay = aligned.copy()
    overlay.putalpha(mask)
    result = canonical.copy()
    result.alpha_composite(overlay)
    identity = canonical.copy()
    identity.putalpha(
        Image.composite(
            canonical.getchannel("A"),
            Image.new("L", canonical.size, 0),
            identity_mask(canonical.size, accessory),
        )
    )
    result.alpha_composite(identity)
    destination.parent.mkdir(parents=True, exist_ok=True)
    result.save(destination, format="PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("canonical", type=Path)
    parser.add_argument("generated_directory", type=Path)
    parser.add_argument("output_directory", type=Path)
    args = parser.parse_args()
    for accessory in ACCESSORIES:
        bake(
            args.canonical,
            args.generated_directory / f"{accessory}.png",
            args.output_directory / f"{accessory}.png",
            accessory,
        )
        print(args.output_directory / f"{accessory}.png")


if __name__ == "__main__":
    main()
