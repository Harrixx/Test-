# image-to-stl

Convert a photo or technical drawing of a simple prismatic part (box, cylinder, or
L-bracket) into an STL file. Claude looks at the image and extracts shape type,
dimensions, and position; the result is rendered as an OpenSCAD script and compiled
to STL with the OpenSCAD CLI.

## Pipeline

1. Load the image and send it to the Anthropic API (`claude-opus-4-8`) with a vision
   prompt, using `client.messages.parse()` to get back a validated `GeometryExtraction`
   Pydantic model (`image_to_stl/models.py`, `image_to_stl/vision.py`).
2. Render that geometry as an OpenSCAD script (`image_to_stl/scad_gen.py`).
3. Compile the script to STL by shelling out to the `openscad` CLI
   (`image_to_stl/compiler.py`).
4. Print the resulting STL path (`image_to_stl/cli.py`).

## Prerequisites

- Python 3.10+
- `pip install -r requirements.txt`
- `ANTHROPIC_API_KEY` set in the environment
- [OpenSCAD](https://openscad.org/downloads.html) installed and on `PATH` (or pass
  `--openscad-bin /path/to/openscad`)

## Usage

```bash
export ANTHROPIC_API_KEY=sk-...
python -m image_to_stl path/to/part.jpg
# -> writes path/to/part.scad and path/to/part.stl, prints the STL path

python -m image_to_stl path/to/part.jpg -o build/part.stl
```

## Supported shapes

- `box` — a rectangular cuboid (`length x width x height`)
- `cylinder` — a cylinder (`radius`, `height`)
- `l_bracket` — a flat L-shaped plate, modeled as a box with a rectangular notch
  cut from one corner

## Notes / Limitations

- Dimensions are estimates from the image (printed annotations are used when
  present); always verify against the source drawing before manufacturing.
- Only single-primitive and simple multi-primitive prismatic parts are targeted;
  curved freeform geometry is out of scope.
- This environment could not install `anthropic`/`pydantic` or the `openscad`
  binary, so the vision call and STL compilation steps are untested end-to-end here
  — only static syntax checking was performed. Verify with a real API key and a
  local OpenSCAD install before relying on this.
