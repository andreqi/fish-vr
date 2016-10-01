// @flow

const Scenario = require('./Scenario.js');
const setup = require('./scene/setup.js');
const genRenderLoop = require('./scene/genRenderLoop.js');

console.log('Move fishes in a virtual world');
const main = () => {
  const scenario = new Scenario();
  console.log('1. Setup');
  const actors = setup(scenario);
  const movie = genRenderLoop(scenario, actors);
  console.log('2. Render');
  movie();
  return {scenario, actors};
};

const world = main();
module.exports = world;
