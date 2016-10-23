// @flow

import type {AvailableActors} from './setup.js';
import type Scenario from '../Scenario.js';

let ROTATIONS = {
  x: 0,
  y: 0,
  z: 0,
};

let MIN_TIME = 0;
const SMOOTH_TIME = 1000.0;

function rotateBoids(t: number, {particles}): void {
  if (t > MIN_TIME) {
    ROTATIONS = {
      x: (0.5 - Math.random()),
      y: (0.5 - Math.random()),
      z: (0.5 - Math.random()),
    }
    MIN_TIME += SMOOTH_TIME;
  }
  const coordinates = ['x', 'y', 'z'];
  particles.children.forEach(boid =>
    coordinates.forEach(dim => boid.rotation[dim] += ROTATIONS[dim] / 50)
  );
}

function genRenderLoop(
  scenario: Scenario,
  actors: AvailableActors,
): () => void {
  let t = 0;
  return function render() {
    requestAnimationFrame(render);
    scenario.controls.update();
    rotateBoids(t, actors.particles);
    scenario.renderer.render(scenario.scene, scenario.camera);
    t += 1/60;
  }
}

module.exports = genRenderLoop;
