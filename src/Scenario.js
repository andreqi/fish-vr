// @flow

const three = require('three');
const OrbitControls = require('three-orbit-controls')(three);

const WEBVR = require('./WEBVR.js');

type Renderer = any;
type Camera = any;
type Scene = any;
type Controls = any;

/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

 const THREE = three;

 THREE.StereoEffect = function ( renderer ) {

	var _stereo = new THREE.StereoCamera();
	_stereo.aspect = 0.5;

	this.setSize = function ( width, height ) {

		renderer.setSize( width, height );

	};

	this.render = function ( scene, camera ) {

		scene.updateMatrixWorld();

		if ( camera.parent === null ) camera.updateMatrixWorld();

		_stereo.update( camera );

		var size = renderer.getSize();

		renderer.setScissorTest( true );
		renderer.clear();

		renderer.setScissor( 0, 0, size.width / 2, size.height );
		renderer.setViewport( 0, 0, size.width / 2, size.height );
		renderer.render( scene, _stereo.cameraL );

		renderer.setScissor( size.width / 2, 0, size.width / 2, size.height );
		renderer.setViewport( size.width / 2, 0, size.width / 2, size.height );
		renderer.render( scene, _stereo.cameraR );

		renderer.setScissorTest( false );

	};

};

 const DeviceOrientationControls = function( object ) {

   var scope = this;

   this.object = object;
   this.object.rotation.reorder( "YXZ" );

   this.enabled = true;

   this.deviceOrientation = {};
   this.screenOrientation = 0;

   this.alpha = 0;
   this.alphaOffsetAngle = 0;


   var onDeviceOrientationChangeEvent = function( event ) {

     scope.deviceOrientation = event;

   };

   var onScreenOrientationChangeEvent = function() {

     scope.screenOrientation = window.orientation || 0;

   };

   // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

   var setObjectQuaternion = function() {

     var zee = new THREE.Vector3( 0, 0, 1 );

     var euler = new THREE.Euler();

     var q0 = new THREE.Quaternion();

     var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis

     return function( quaternion, alpha, beta, gamma, orient ) {

       euler.set( beta, alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

       quaternion.setFromEuler( euler ); // orient the device

       quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

       quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation

     }

   }();

   this.connect = function() {

     onScreenOrientationChangeEvent(); // run once on load

     window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
     window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

     scope.enabled = true;

   };

   this.disconnect = function() {

     window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
     window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

     scope.enabled = false;

   };

   this.update = function() {

     if ( scope.enabled === false ) return;

     var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad( scope.deviceOrientation.alpha ) + this.alphaOffsetAngle : 0; // Z
     var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad( scope.deviceOrientation.beta ) : 0; // X'
     var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad( scope.deviceOrientation.gamma ) : 0; // Y''
     var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

     setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
     this.alpha = alpha;

   };

   this.updateAlphaOffsetAngle = function( angle ) {

     this.alphaOffsetAngle = angle;
     this.update();

   };

   this.dispose = function() {

     this.disconnect();

   };

   this.connect();

 };


function setOrientationControls(e, scenario) {
  if (!e.alpha) {
    return;
  }

  scenario.controls = new DeviceOrientationControls(scenario.camera, true);
  scenario.controls.connect();
  scenario.controls.update();

  window.removeEventListener('deviceorientation', scenario.listener, true);

  if (scenario.renderer.domElement) {
    scenario.renderer.domElement.addEventListener('click', function () {
      if (this.requestFullscreen) {
        this.requestFullscreen();
      } else if (this.msRequestFullscreen) {
        this.msRequestFullscreen();
      } else if (this.mozRequestFullScreen) {
        this.mozRequestFullScreen();
      } else if (this.webkitRequestFullscreen) {
        this.webkitRequestFullscreen();
      }
    });

    const effect = new three.StereoEffect(scenario.renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    scenario.renderer = effect;
  }
}

class Scenario {
  renderer: Renderer;
  camera: Camera;
  scene: Scene;
  listener: Function;
  controls: Controls;

  constructor() {
    // renderer
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
      100
    );
    this.camera.position.set(0, 0, 0);
    this.camera.focalLength = this.camera.position.distanceTo(
      this.scene.position
    );

    // controls
    this.controls = new OrbitControls(this.camera);

    if (WEBVR.isAvailable()) {
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
    const listener = (e) => setOrientationControls(e, this);
    this.listener = listener;
    window.addEventListener('deviceorientation', listener, true);
  }
}

module.exports = Scenario;
