// @flow

const three = require('three');

type ThreeGeometry = any;

export type ParticlesType = {
  object: ThreeGeometry,
  particles: {
    children: Array<ThreeGeometry>,
  },
};

function generateParticles(): ParticlesType {
  const material = new three.MeshPhongMaterial({
    color: 0xFFFFcc,
    shading: three.SmoothShading
  });
  // cubes
  const gridSize = 40;
  const geo = new three.BoxGeometry(.2, .2, .2, 1, 1, 1)
  const particles = new three.Object3D();
  for (let _x = -gridSize; _x <= gridSize; _x++) {
    for (let _y = -gridSize; _y <= gridSize; _y++) {
      const mesh = new three.Mesh(geo, material)
      mesh.position.set(_x, 0, _y)
      particles.add(mesh);
    }
  }

  return {
    object: particles,
    particles,
  };
}

module.exports = generateParticles;
