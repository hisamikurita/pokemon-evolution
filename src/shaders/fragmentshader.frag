precision mediump float;

uniform float colorLevel_1;
uniform float colorLevel_2;
uniform float colorLevel_3;

varying vec3 v_color_1;
varying vec3 v_color_2;
varying vec3 v_color_3;

void main() {
    vec3 imageColor_1 = v_color_1 * colorLevel_1;
    vec3 imageColor_2 = v_color_2 * colorLevel_2;
    vec3 imageColor_3 = v_color_3 * colorLevel_3;
    vec3 imageColorAll = imageColor_1 + imageColor_2 + imageColor_3;
    if ( imageColorAll.r < 0.01 && imageColorAll.g < 0.01 && imageColorAll.b < 0.01 ) discard;
    gl_FragColor = vec4(imageColorAll,1.0);
}