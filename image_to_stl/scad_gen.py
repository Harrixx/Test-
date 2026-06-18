"""Generates an OpenSCAD script from extracted geometry."""

from __future__ import annotations

from .models import GeometryExtraction, Shape, ShapeType


def _box_scad(shape: Shape) -> str:
    d = shape.box
    p = shape.position
    return f"translate([{p.x}, {p.y}, {p.z}]) cube([{d.length}, {d.width}, {d.height}]);"


def _cylinder_scad(shape: Shape) -> str:
    d = shape.cylinder
    p = shape.position
    return f"translate([{p.x}, {p.y}, {p.z}]) cylinder(h={d.height}, r={d.radius}, $fn=64);"


def _l_bracket_scad(shape: Shape) -> str:
    d = shape.l_bracket
    p = shape.position
    notch_x = d.length - d.notch_length
    notch_y = d.width - d.notch_width
    return "\n".join(
        [
            f"translate([{p.x}, {p.y}, {p.z}]) difference() {{",
            f"    cube([{d.length}, {d.width}, {d.height}]);",
            f"    translate([{notch_x}, {notch_y}, -0.5])",
            f"        cube([{d.notch_length} + 1, {d.notch_width} + 1, {d.height} + 1]);",
            "}",
        ]
    )


_BUILDERS = {
    ShapeType.BOX: _box_scad,
    ShapeType.CYLINDER: _cylinder_scad,
    ShapeType.L_BRACKET: _l_bracket_scad,
}


def generate_scad(geometry: GeometryExtraction) -> str:
    """Render extracted geometry as OpenSCAD source text."""
    lines = [f"// {geometry.summary}", f"// units: {geometry.units}", ""]
    for index, shape in enumerate(geometry.shapes):
        builder = _BUILDERS.get(shape.type)
        if builder is None:
            raise ValueError(f"Unsupported shape type: {shape.type}")
        lines.append(f"// {shape.label or f'shape {index}'}")
        lines.append(builder(shape))
        lines.append("")
    return "\n".join(lines)
