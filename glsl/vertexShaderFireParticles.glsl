precision highp float;
precision highp int;
attribute float size;
attribute vec3 customColor;
attribute float customAlpha;
attribute float speedFactor;
attribute float angleFactor;
attribute float distortFlameFactor;
attribute float distortAlphaFactor;

varying vec3 vColor;
varying float vAlpha;
varying float vSpeedFactor;
varying float vAngleFactor;
varying float vSize;
varying vec3 vPos;

varying float vDistortFlameFactor;
varying float vDistortAlphaFactor;


void main() {

    vColor = customColor;
    vAlpha = customAlpha;
    vSpeedFactor = speedFactor;
    vAngleFactor = angleFactor;
    vSize = size;
    vPos = position;

    vDistortFlameFactor = distortFlameFactor;
    vDistortAlphaFactor = distortAlphaFactor;

    vec3 pos = position;
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

    gl_PointSize = size * ( 250.0 / length( mvPosition.xyz ) );

    gl_Position = projectionMatrix * mvPosition;
}