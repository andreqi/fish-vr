// @flow

import type {AvailableActors} from './setup.js';
import type Scenario from '../Scenario.js';

function genRenderLoop(
  scenario: Scenario,
  actors: AvailableActors,
): () => void {
  let t = 0;
  return function render() {
    requestAnimationFrame(render);
    scenario.controls.update();
    scenario.renderer.render(scenario.scene, scenario.camera);
    t += 1/60;
  }
}

module.exports = genRenderLoop;
