// @flow

const BoidsInTorus = require('./scene/movies/BoidsInTorus.js');
const ManualControlBoid = require('./scene/movies/ManualControlBoid.js');
const BoidsWithMovement = require('./scene/movies/BoidsWithMovement.js');
const Scenario = require('./Scenario.js');

const three = require('three');
const genRenderLoop = require('./scene/genRenderLoop.js');

console.log('Move fishes in a virtual world');
const main = ({setup, update}, deps, keyboard) => {
  const scenario = new Scenario();
  console.log('1. Setup');
  const state = setup(scenario, deps);
  const {actors} = state;
  Object.keys(actors).forEach(key => {
    scenario.scene.add(actors[key].object);
    console.log(`Adding ${key} to the scene`);
  });
  const movie = genRenderLoop(scenario, t => update(t, state, keyboard));
  console.log('2. Render');
  movie();
  return {scenario, state};
};

const keyboard: {[key: string]: boolean} = {};
const world = main(BoidsWithMovement, {}, keyboard);
window.world = world;

// setup keyboard support
document.addEventListener('keydown', (e: KeyboardEvent) => {
  const {key} = e;
  keyboard[key] = true;
});
document.addEventListener('keyup', (e: KeyboardEvent) => {
  const {key} = e;
  keyboard[key] = false;
});
module.exports = world;
