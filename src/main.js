// @flow

const BoidsInTorus = require('./scene/movies/BoidsInTorus.js');
const Scenario = require('./Scenario.js');
const genRenderLoop = require('./scene/genRenderLoop.js');

console.log('Move fishes in a virtual world');
const main = ({setup, update}) => {
  const scenario = new Scenario();
  console.log('1. Setup');
  const actors = setup(scenario);
  Object.keys(actors).forEach(key => {
    scenario.scene.add(actors[key].object);
    console.log(`Adding ${key} to the scene`);
  });
  const movie = genRenderLoop(scenario, t => update(t, actors));
  console.log('2. Render');
  movie();
  return {scenario, actors};
};

const world = main(BoidsInTorus);
module.exports = world;
