const vertexShaderCode = `
precision mediump float;

attribute vec3 position;
attribute vec3 colour;
uniform mat3 positionTransform;
uniform float xScale;

varying vec3 vColour;
varying float z;

void main() {
  vec3 transformedPosition = position * positionTransform;
  transformedPosition.xy *= 1.5 / (1.5 + transformedPosition.z);
  transformedPosition.z *= 0.3;
  transformedPosition.x *= xScale;
  gl_Position = vec4(transformedPosition, 1.0);
  vColour = colour;
  z = transformedPosition.z * 3.0;
}`;

const fragmentShaderCode = `
precision mediump float;

varying vec3 vColour;
varying float z;

void main() {
	gl_FragColor = vec4(mix(vColour, vec3(0.0, 0.0, 0.3), z), 1.0);
}`;