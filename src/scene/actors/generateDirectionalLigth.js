// @flow

import type {LightType} from './LightType.js';

const three = require('three');

function generateDirectionalLigth(): LightType {
  const light = new three.DirectionalLight(0xffffff);
  light.position.set(-1, 1.5, 0.5);
  return {object: light};
}

module.exports = generateDirectionalLigth;
