// @flow

const three = require('three');

type ThreeGeometry = any;

export type ParticlesType = {
  object: ThreeGeometry,
  particles: {
    children: Array<ThreeGeometry>,
  },
};

function generateParticles() {
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
      //for (let _z = -gridSize; _z <= gridSize; _z++) {
        const mesh = new three.Mesh(geo, material)
        mesh.position.set(_x, 0, _y)
        particles.add(mesh);
      //}
    }
  }
  // if you want to group, you loose movement of particles
  // merge
  /*const geom = new three.Geometry()
  for (let i = 0; i < particles.children.length; i++) {
    particles.children[i].updateMatrix();
    geom.merge(
      particles.children[i].geometry,
      particles.children[i].matrix
    );
  }*/
  //const group = new three.Mesh(particles, material);
  console.log(particles);
  return {
    object: particles,
    particles,
  };
}

module.exports = generateParticles;
