// @flow

const Scenario = require('./Scenario.js');
const setup = require('./scene/setup.js');
const genRenderLoop = require('./scene/genRenderLoop.js');

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
module.exports = world;
