// @flow

const three = require('three');

export type TorusType = {
  object: any,
};

function generateTorus(): TorusType {
  const geometry = new three.TorusKnotGeometry(1.14, 0.85, 65, 11);
  const material = new three.MeshPhongMaterial({
    color: 0xFFFFcc,
    shading: three.SmoothShading,
  });
  const object = new three.Mesh(geometry, material);
  return {object};
}

module.exports = generateTorus;
