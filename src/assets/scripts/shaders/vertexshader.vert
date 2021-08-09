attribute vec3 position;
attribute vec3 color_1;
attribute vec3 color_2;
attribute vec3 color_3;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float noiseRangeX;
uniform float noiseRangeY;
uniform float noiseRangeZ;
uniform float distortionLevel;
uniform float distortionRange;
uniform float time;
varying vec3 v_color_1;
varying vec3 v_color_2;
varying vec3 v_color_3;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

void main() {
    v_color_1 = color_1;
    v_color_2 = color_2;
    v_color_3 = color_3;
    float noiseX = position.x * noiseRangeX + time;
    float noiseY = position.y * noiseRangeY + time;
    float noiseZ = (position.x + position.y) * noiseRangeZ + time;
    vec3 distortionPosition = position * snoise3(vec3(noiseX, noiseY, noiseZ)) * distortionLevel * distortionRange;
    vec3 resultPosition = position + distortionPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(resultPosition, 1.0 );
    gl_PointSize = 2.0;
}