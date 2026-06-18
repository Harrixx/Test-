"""Pydantic schema describing the 3D geometry Claude extracts from an image."""

from __future__ import annotations

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class ShapeType(str, Enum):
    BOX = "box"
    CYLINDER = "cylinder"
    L_BRACKET = "l_bracket"


class Position(BaseModel):
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0


class BoxDimensions(BaseModel):
    length: float = Field(..., description="Size along the X axis, in mm.")
    width: float = Field(..., description="Size along the Y axis, in mm.")
    height: float = Field(..., description="Size along the Z axis, in mm.")


class CylinderDimensions(BaseModel):
    radius: float = Field(..., description="Radius, in mm.")
    height: float = Field(..., description="Height along the Z axis, in mm.")


class LBracketDimensions(BaseModel):
    """An L-shaped plate: a box with a rectangular notch removed from one corner."""

    length: float = Field(..., description="Overall length along the X axis, in mm.")
    width: float = Field(..., description="Overall width along the Y axis, in mm.")
    height: float = Field(..., description="Extrusion thickness along the Z axis, in mm.")
    notch_length: float = Field(..., description="Length of material removed from one corner along X, in mm.")
    notch_width: float = Field(..., description="Width of material removed from the same corner along Y, in mm.")


class Shape(BaseModel):
    type: ShapeType
    box: Optional[BoxDimensions] = None
    cylinder: Optional[CylinderDimensions] = None
    l_bracket: Optional[LBracketDimensions] = None
    position: Position = Field(default_factory=Position)
    label: Optional[str] = Field(None, description="Short human-readable name for this shape/feature.")


class GeometryExtraction(BaseModel):
    summary: str = Field(..., description="One or two sentence description of the part.")
    units: str = Field("mm", description="Unit used for all dimensions.")
    shapes: List[Shape]
