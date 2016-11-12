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

function generateCubeMap(texture): ThreeMesh {
  const mesh = new three.Mesh(
    new three.SphereGeometry( 500, 32, 16 ),
    new three.MeshBasicMaterial({
      map: texture,
    }),
  );
  mesh.scale.x = -1;
  return mesh;
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
}

module.exports = {
  setup,
  update: operateBoid,
}
