import * as THREE from 'three';
import { gsap } from 'gsap';
import * as dat from 'dat.gui';
import ImagePixelFilter from './image-pixel-filter';
import vertexShader from '../shaders/vertexshader.vert';
import fragmentShader from '../shaders/fragmentshader.frag';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { webpCheckDevice } from '../utility/webp-check-device';

export default class Mesh {
  constructor(stage) {
    this.stage = stage;
    this.img = [];
    this.imgData = [];
    this.duration = 3.2;
    this.ease = 'power2.inOut';
    this.distortionRange = 30;
    this.noiseRangeX = 0.007;
    this.noiseRangeY = 0.006;
    this.noiseRangeZ = 0.009;
    this.timeSpeed = 0.0005;
    this.bloomStrength = 4.0;

    this.composer = new EffectComposer(this.stage.renderer);
    this.composer.addPass(new RenderPass(this.stage.scene, this.stage.camera));
    this.UnrealBloomPass = new UnrealBloomPass(new THREE.Vector2(this.stage.width, this.stage.height), 0.0, 1.4, 0.0);
    this.composer.addPass(this.UnrealBloomPass);

    this.extension = webpCheckDevice();
  }

  init() {
    this._getImageData().then(() => this._setMesh(), this._setGui());
  }

  _getImageData() {
    return new Promise((resolve) => {
      for (let i = 0; i < 3; i++) {
        this.img[i] = new Image();
        this.img[i].width = 950;
        this.img[i].height = 950;
        this.img[i].crossOrigin = "anonymous";
        this.img[i].src = `./assets/images/pokemon0${(i + 1.0)}${this.extension}`;

        this.img[i].addEventListener('load', () => {
          this.imgData[i] = new ImagePixelFilter(this.img[i], this.img[i].width, this.img[i].height, 5);
          if (i >= 2) resolve();
        });
      }
    });
  }

  _setMesh() {
    const position = this.imgData[0].getPosition();
    const positions = new THREE.BufferAttribute(new Float32Array(position), 3);
    const color_1 = this.imgData[0].getColor();
    const colors_1 = new THREE.BufferAttribute(new Float32Array(color_1), 3);
    const color_2 = this.imgData[1].getColor();
    const colors_2 = new THREE.BufferAttribute(new Float32Array(color_2), 3);
    const color_3 = this.imgData[2].getColor();
    const colors_3 = new THREE.BufferAttribute(new Float32Array(color_3), 3);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', positions);
    this.geometry.setAttribute('color_1', colors_1);
    this.geometry.setAttribute('color_2', colors_2);
    this.geometry.setAttribute('color_3', colors_3);

    this.material = new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: false,
      depthTest: true,
      uniforms: {
        noiseRangeX: { type: 'f', value: this.noiseRangeX },
        noiseRangeY: { type: 'f', value: this.noiseRangeY },
        noiseRangeZ: { type: 'f', value: this.noiseRangeX },
        colorLevel_1: { type: 'f', value: 0.0 },
        colorLevel_2: { type: 'f', value: 0.0 },
        colorLevel_3: { type: 'f', value: 0.0 },
        distortionLevel: { type: 'f', value: 0.0 },
        distortionRange: { type: 'f', value: this.distortionRange },
        time: { type: 'f', value: 0.0 },
      }
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.stage.scene.add(this.mesh);
  }

  _diffuseConverge(number) {
    gsap.to(this.mesh.material.uniforms.distortionLevel, {
      duration: 3.0,
      ease: 'power2.inOut',
      value: 1.0,
    }).eventCallback('onComplete', () => {
      this._nextColor(number);
      gsap.to(this.mesh.material.uniforms.distortionLevel, {
        duration: 3.0,
        ease: 'power2.inOut',
        value: 0.0,
      })
    });
    gsap.to(this.UnrealBloomPass, {
      duration: this.duration,
      ease: 'power2.inOut',
      strength: this.bloomStrength,
    }).eventCallback('onComplete', () => {
      gsap.to(this.UnrealBloomPass, {
        duration: this.duration,
        ease: 'power2.inOut',
        strength: 0.0,
      })
    });
  }

  _nextColor(number) {
    switch (number) {
      case 0:
        gsap.to(this.mesh.material.uniforms.colorLevel_3, {
          duration: this.duration,
          ease: this.ease,
          value: 0.0,
        });
        gsap.to(this.mesh.material.uniforms.colorLevel_1, {
          duration: this.duration,
          ease: this.ease,
          value: 1.0,
        });
        break;
      case 1:
        gsap.to(this.mesh.material.uniforms.colorLevel_1, {
          duration: this.duration,
          ease: this.ease,
          value: 0.0,
        });
        gsap.to(this.mesh.material.uniforms.colorLevel_2, {
          duration: this.duration,
          ease: this.ease,
          value: 1.0,
        });
        break;
      case 2:
        gsap.to(this.mesh.material.uniforms.colorLevel_2, {
          duration: this.duration,
          ease: this.ease,
          value: 0.0,
        });
        gsap.to(this.mesh.material.uniforms.colorLevel_3, {
          duration: this.duration,
          ease: this.ease,
          value: 1.0,
        });
        break;
    }
  }

  _setGui() {
    const parameter = {
      distortionRange: this.distortionRange,
      noiseRangeX: this.noiseRangeX,
      noiseRangeY: this.noiseRangeY,
      noiseRangeZ: this.noiseRangeZ,
      timeSpeed: this.timeSpeed,
      bloomStrength: this.bloomStrength,
    };
    const gui = new dat.GUI();
    gui.add(parameter, 'distortionRange', 0.0, 100, 1.0).onChange((value) => {
      this.mesh.material.uniforms.distortionRange.value = value;
    });
    gui.add(parameter, 'noiseRangeX', 0.0, 0.01, 0.001).onChange((value) => {
      this.mesh.material.uniforms.noiseRangeX.value = value;
    });
    gui.add(parameter, 'noiseRangeY', 0.0, 0.01, 0.001).onChange((value) => {
      this.mesh.material.uniforms.noiseRangeY.value = value;
    });
    gui.add(parameter, 'noiseRangeZ', 0.0, 0.01, 0.001).onChange((value) => {
      this.mesh.material.uniforms.noiseRangeY.value = value;
    });
    gui.add(parameter, 'bloomStrength', 0.0, 10.0, 1.0).onChange((value) => {
      this.bloomStrength = value;
    });
  }

  _render() {
    this.mesh.material.uniforms.time.value += this.timeSpeed;
    this.composer.render();
  }

  onRaf() {
    this._render();
  }
}