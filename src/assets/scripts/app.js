import Stage from './module/stage';
import Mesh from './module/mesh';
import { gsap } from 'gsap';

export default class Slider {
    constructor() {
        this.stage = new Stage();
        this.stage.init();

        this.mesh = new Mesh(this.stage);
        this.mesh.init();

        window.addEventListener('resize', () => {
            this.stage.onResize();
        });

        this.currentNum = 0;

        window.addEventListener('load', () => {
            this.mesh._nextColor(this.currentNum);
            this._autoChangeSlide();

            const _raf = () => {
                window.requestAnimationFrame(() => {
                    this.stage.onRaf();
                    this.mesh.onRaf();

                    _raf();
                });
            }
            _raf();
        });
    }
    _moveChangeSlide() {
        if (this.currentNum > 1) {
            this.currentNum = 0;
        }
        else {
            this.currentNum++;
        }
    }
    _autoChangeSlide() {
        gsap.to({}, {
            ease: 'none',
            duration: 7.0,
            delay: -5.0,
            repeat: -1.0,
        }).eventCallback('onRepeat', () => {
            this._moveChangeSlide();
            setTimeout(() => {
                this.mesh._diffuseConverge(this.currentNum);
            }, 1000)
        });
    }
}

new Slider();