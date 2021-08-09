export default class ImagePixelFilter {
  constructor(_image, _width, _height, _ratio) {
    this.position = [];
    this.color = [];
    this.id = [];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = _width;
    canvas.height = _height;
    ctx.drawImage(_image, 0, 0);
    const originalPixel = ctx.getImageData(0, 0, _width, _height);

    for (let i = 0; i < originalPixel.data.length; i++) {
      if ((i + 1) % (4 * _ratio) === 0) {
        const colorR = originalPixel.data[i - 3] / 255;
        const colorG = originalPixel.data[i - 2] / 255;
        const colorB = originalPixel.data[i - 1] / 255;

        const count = (i + 1) / 4 - 1;

        const nx = count % _width;
        const ny = Math.floor(count / _width);
        const nz = 0;

        const x = nx - _width / 2;
        const y = -(ny - _height / 2);
        const z = 0.0;

        this.position.push(x, y, z);
        this.color.push(colorR, colorG, colorB);
        this.id.push(nx, ny, nz);
      }
    }
  }

  getId() {
    return this.id;
  }

  getPosition() {
    return this.position;
  }

  getColor() {
    return this.color;
  }

  getArrayLength() {
    return (this.position.length / 3);
  }
}