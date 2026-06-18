"""CLI entrypoint: image -> Claude geometry extraction -> OpenSCAD -> STL."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import List, Optional

from .compiler import OpenSCADCompilationError, OpenSCADNotFoundError, compile_scad_to_stl
from .scad_gen import generate_scad
from .vision import extract_geometry


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="image-to-stl",
        description="Convert a photo or technical drawing of a simple prismatic part into an STL file.",
    )
    parser.add_argument("image", type=Path, help="Path to the input image (photo or technical drawing).")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=None,
        help="Path to write the output STL file (default: alongside the input image).",
    )
    parser.add_argument(
        "--openscad-bin",
        default="openscad",
        help="Path to the OpenSCAD executable (default: 'openscad' on PATH).",
    )
    return parser


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    image_path: Path = args.image
    if not image_path.is_file():
        print(f"Error: image file not found: {image_path}", file=sys.stderr)
        return 1

    output_path: Path = args.output or image_path.with_suffix(".stl")
    scad_path = output_path.with_suffix(".scad")

    print(f"Extracting geometry from {image_path} ...")
    try:
        geometry = extract_geometry(image_path)
    except Exception as exc:
        print(f"Error: failed to extract geometry from image: {exc}", file=sys.stderr)
        return 1

    print(f"Detected {len(geometry.shapes)} shape(s): {geometry.summary}")

    scad_source = generate_scad(geometry)
    scad_path.write_text(scad_source)
    print(f"Wrote OpenSCAD script to {scad_path}")

    try:
        compile_scad_to_stl(scad_path, output_path, openscad_bin=args.openscad_bin)
    except (OpenSCADNotFoundError, OpenSCADCompilationError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    print(f"STL written to {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
