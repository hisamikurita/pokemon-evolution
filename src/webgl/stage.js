export default class Stage {
    constructor() {
        this.renderParam = {
            clearColor: 0x000000,
            width: window.innerWidth,
            height: window.innerHeight,
        };
        this.cameraParam = {
            fov: 45,
            near: .1,
            far: 10000,
            lookAt: new THREE.Vector3(0, 0, 0),
            x: 0,
            y: 0,
            z: 2400,
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.geometry = null;
        this.material = null;
        this.mesh = null;
        this.isInitialized = false;
        this.orbitcontrols = null;
        this.stats = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }

    init() {
        this._setScene();
        this._setRender();
        this._setCamera();
        this._setDev();
        this.isInitialized = true;
    }

    _setDev() {
        this.orbitcontrols = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        this.stats = new Stats();
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.left = "0px";
        this.stats.domElement.style.right = "0px";
        document.getElementById("stats").appendChild(this.stats.domElement);
        return this.stats;
    }

    _setScene() {
        this.scene = new THREE.Scene();
    }

    _setRender() {
        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpla: false });
        this.renderer.setPixelRatio(2.0);
        this.renderer.setClearColor(new THREE.Color(this.renderParam.clearColor));
        this.renderer.setSize(this.renderParam.width, this.renderParam.height);
        const wrapper = document.querySelector('#webgl');
        wrapper.appendChild(this.renderer.domElement);
    }

    _setCamera() {
        if (!this.isInitialized) {
            this.camera = new THREE.PerspectiveCamera(
                45,
                this.renderParam.width / this.renderParam.height,
                this.cameraParam.near,
                this.cameraParam.far,
            );

            this.camera.position.set(this.cameraParam.x, this.cameraParam.y, this.cameraParam.z);
            this.camera.lookAt(this.cameraParam.lookAt);
        }

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    _render() {
        this.orbitcontrols.update();
        this.stats.update();
        // this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this._setCamera();
    }

    onRaf() {
        this._render();
    }
}