"""Invokes the OpenSCAD CLI to compile a .scad script into an .stl file."""

from __future__ import annotations

import shutil
import subprocess
from pathlib import Path


class OpenSCADNotFoundError(RuntimeError):
    pass


class OpenSCADCompilationError(RuntimeError):
    pass


def compile_scad_to_stl(scad_path: Path, stl_path: Path, openscad_bin: str = "openscad") -> Path:
    """Run `openscad -o stl_path scad_path`, raising on missing binary or compile errors."""
    if shutil.which(openscad_bin) is None:
        raise OpenSCADNotFoundError(
            f"'{openscad_bin}' was not found on PATH. Install OpenSCAD "
            "(https://openscad.org/downloads.html) or pass --openscad-bin with the full path "
            "to the executable."
        )

    result = subprocess.run(
        [openscad_bin, "-o", str(stl_path), str(scad_path)],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise OpenSCADCompilationError(
            f"OpenSCAD failed to compile {scad_path} (exit code {result.returncode}):\n{result.stderr}"
        )
    return stl_path
