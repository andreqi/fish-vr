// @flow

import type {AvailableActors} from './setup.js';
import type Scenario from '../Scenario.js';

function wavyParticleEffect({object, particles}, t: number) {
  if (t === 0) console.log(object, particles);

  const gridSize = 40;
  let idx = 0;
  for (let _x = -gridSize; _x <= gridSize; _x++) {
    for (let _y = -gridSize; _y <= gridSize; _y++) {
      const particle = particles.children[idx];
      particle.position.setY(
        10 * Math.sin(t/2 + (Math.abs(_x*_x*_x) + Math.abs(_y*_y*_y))/50)
      );
      idx++;
    }
  }
}

function genRenderLoop(
  scenario: Scenario,
  actors: AvailableActors,
): () => void {
  let t = 0;
  return function render() {
    requestAnimationFrame(render);
    scenario.controls.update();
    wavyParticleEffect(actors.particles, t);
    scenario.renderer.render(scenario.scene, scenario.camera);
    t += 1/60;
  }
}

module.exports = genRenderLoop;
