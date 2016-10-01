// @flow

import Scenario from './Scenario.js';
import setup from './scene/setup.js'
import genRenderLoop from './scene/genRenderLoop.js'

console.log('Move fishes in a virtual world');
const main = () => {
  const scenario = new Scenario();
  const actors = setup(scenario.scene);
  const movie = genRenderLoop(scenario, actors);
  movie();
  return {scenario, actors};
};

const world = main();
console.log('1. Setup');

console.log('2. Render');
export default world;
