// @flow

const three = require('three');
const FishTorus = require('./FishTorus.js');

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

  // boids
  const geo = new three.CylinderGeometry(0, .2, 1, 3);
  const particles = new three.Object3D();
  for (let idx = 0; idx < 1000; idx++) {
    const mesh = new three.Mesh(geo, material);
    const pos = FishTorus.getRandomPoint();
    mesh.position.set(pos.x, pos.y, pos.z);
    particles.add(mesh);
  }

  return {
    object: particles,
    particles,
  };
}

module.exports = generateParticles;
