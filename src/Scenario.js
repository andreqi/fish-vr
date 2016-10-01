// @flow

const three = require('three');
const OrbitControls = require('three-orbit-controls')(three);

type Renderer = any;
type Camera = any;
type Scene = any;
type Controls = any;

const WEBVR = {
  isAvailable: () => false,
  getButton: (): any => false,
};

class Scenario {
  renderer: Renderer;
  camera: Camera;
  scene: Scene;
  controls: Controls;

  constructor() {
    // renderer
    console.log(three);
    this.renderer = new three.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // scene
    this.scene = new three.Scene();

    // camera
    this.camera = new three.PerspectiveCamera(
      90, // angle adjust perspective
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 3);
    this.camera.focalLength = this.camera.position.distanceTo(
      this.scene.position
    );

    // controls
    this.controls = new OrbitControls(this.camera);
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = -1

    if (WEBVR.isAvailable() === true) {
      this.controls = new three.VRControls(this.camera);
      this.controls.standing = false;

      this.renderer = new three.VREffect(this.renderer);
      document.body.appendChild(WEBVR.getButton(this.renderer));
    }

    // events
    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false);
    
    // window.addEventListener('deviceorientation', setOrientationControls, true);
  }
}

module.exports = Scenario;
