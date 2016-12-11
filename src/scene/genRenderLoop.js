// @flow

import type Scenario from '../Scenario.js';

function genRenderLoop(
  scenario: Scenario,
  update: (t: number) => void,
): () => void {
  let t = 0;
  return function renderLoop() {
    scenario.controls.update();
    update(t);
    scenario.renderer.render(scenario.scene, scenario.camera);
    t += 1/60;
    requestAnimationFrame(renderLoop);
  }
}

module.exports = genRenderLoop;
