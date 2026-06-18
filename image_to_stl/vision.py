"""Calls the Anthropic API with a vision prompt to extract part geometry."""

from __future__ import annotations

import base64
import mimetypes
from pathlib import Path
from typing import Optional

import anthropic

from .models import GeometryExtraction

MODEL = "claude-opus-4-8"

SYSTEM_PROMPT = """You are a mechanical CAD assistant. Look at the supplied image, which is \
either a photo or a technical drawing of a simple prismatic part. Identify each distinct solid \
in the part and classify it as one of: box, cylinder, l_bracket.

Estimate real-world dimensions in millimeters using any printed dimensions/annotations in the \
drawing first, then visual proportions and typical part sizes if no annotations are present. \
If the part is a single primitive, return exactly one shape.

Only use l_bracket for parts with a clear L-shaped cross-section extruded into a flat plate; \
model it as an overall bounding box (length x width x height) with a rectangular notch removed \
from one corner (notch_length x notch_width).

Be decisive: always produce numeric dimensions, never leave a field blank, and do not ask for \
clarification."""

_SUPPORTED_MEDIA_TYPES = {"image/png", "image/jpeg", "image/gif", "image/webp"}


def _load_image(path: Path) -> tuple[str, str]:
    media_type, _ = mimetypes.guess_type(path.name)
    if media_type not in _SUPPORTED_MEDIA_TYPES:
        media_type = "image/png"
    data = base64.standard_b64encode(path.read_bytes()).decode("utf-8")
    return media_type, data


def extract_geometry(
    image_path: Path,
    client: Optional[anthropic.Anthropic] = None,
) -> GeometryExtraction:
    """Send the image to Claude and return structured 3D geometry."""
    client = client or anthropic.Anthropic()
    media_type, data = _load_image(image_path)

    response = client.messages.parse(
        model=MODEL,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {"type": "base64", "media_type": media_type, "data": data},
                    },
                    {
                        "type": "text",
                        "text": "Extract the 3D geometry (shapes, dimensions, features) of the part shown.",
                    },
                ],
            }
        ],
        output_format=GeometryExtraction,
    )
    return response.parsed_output
