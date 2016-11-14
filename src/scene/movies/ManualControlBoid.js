// @flow

import type {LightType} from '../actors/LightType.js';
import type {ThreeMesh} from '../actors/ThreeTypes.js';

const Boid = require('../actors/Boid.js');

const three = require('three');
const generateDirectionalLigth = require('../actors/generateDirectionalLigth.js');

type Actors = {
  boid: {
    object: ThreeMesh,
    model: Boid,
  },
  cubeMap: {
    object: ThreeMesh
  },
  ambientLight: LightType,
  directionalLight: LightType,
};

type State = {
  actors: Actors,
  env: {},
};

function generateCubeMap(): ThreeMesh {
  const grid = new three.Object3D();
  const size = 20.0;
  const geometry = new three.BoxGeometry(size, size, size, 1, 1, 1);
  const texture = new three.MeshPhongMaterial({
    color: 0xFFFFFF,
    wireframe: true,
  });
  const times = 1;
  for (let idx = -times; idx <= times; idx++) {
    for (let idy = -times; idy <= times; idy++) {
      for (let idz = -times; idz <= times; idz++) {
        const mesh = new three.Mesh(geometry, texture);
        mesh.position.set(idx * size, idy * size, idz * size)
        grid.add(mesh);
      }
    }
  }
  return grid;
}

function setup(_: any, {texture}: any): State {
  const boidModel = new Boid();
  return {
    actors: {
      boid: {
        object: boidModel.getMesh(),
        model: boidModel,
      },
      ambientLight: {
        object: new three.AmbientLight(0xaaaaaa)
      },
      directionalLight: generateDirectionalLigth(),
      cubeMap: {
        object: generateCubeMap(texture),
      },
    },
    env: {},
  };
}

function operateBoid(
  t: number,
  {actors, env}: State,
  keyboard: {[key: string]: boolean},
): void {
  actors.boid.model.updateFromKeyboard(keyboard);
}

module.exports = {
  setup,
  update: operateBoid,
}
