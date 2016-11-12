// @flow

const three = require('three');
const FishTorus = require('./FishTorus.js');

export type TorusType = {
  object: any,
};

function generateTorus(): TorusType {
  const {radius, tubeRadius} = FishTorus.getParams();
  const geometry = new three.TorusGeometry(radius, tubeRadius, 20, 20);
  const material = new three.MeshPhongMaterial({
    color: 0xFFFFcc,
    wireframe: true,
  });
  const object = new three.Mesh(geometry, material);
  object.position.set(0, 0, 0);
  return {object};
}

module.exports = generateTorus;
