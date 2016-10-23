// @flow

type Point = {
  x: number,
  y: number,
  z: number,
};

const EPS = 0.5;

function applyPerimetric(
  u: number,
  v: number,
  tubeRadius: number,
  radius: number,
): Point {
  return {
    x: (radius + tubeRadius * Math.cos(v)) * Math.cos(u),
    y: (radius + tubeRadius * Math.cos(v)) * Math.sin(u),
    z: tubeRadius * Math.sin(v),
  };
}

class FishTorus {
  _radius: number;
  _tubeRadius: number;

  constructor(radius: number, tubeRadius: number) {
    this._radius = radius;
    this._tubeRadius = tubeRadius;
  }

  getRandomPoint(): {x: number, y: number, z: number} {
    const u = Math.random() * 2 * Math.PI;
    const v = Math.random() * 2 * Math.PI;
    const tube = Math.random() * this._tubeRadius - EPS;
    return applyPerimetric(u, v, tube, this._radius);
  }

  getParams(): {radius: number, tubeRadius: number} {
    return {
      radius: this._radius,
      tubeRadius: this._tubeRadius,
    };
  }
};

module.exports = new FishTorus(20, 10);
