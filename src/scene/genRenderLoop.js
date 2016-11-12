// @flow

import type Scenario from '../Scenario.js';

function genRenderLoop(
  {camera, controls, renderer, scene}: Scenario,
  update: (t: number) => void,
): () => void {
  let t = 0;
  // controls.autoRotate = true;
  // controls.autoRotateSpeed = -1

  return function renderLoop() {
    controls.update();
    update(t);
    renderer.render(scene, camera);
    t += 1/60;
    requestAnimationFrame(renderLoop);
  }
}

module.exports = genRenderLoop;
