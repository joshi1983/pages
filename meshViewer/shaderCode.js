const vertexShaderCode = `
precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec3 colour;
uniform mat3 positionTransform;
uniform float viewportZ;
uniform vec2 scale;

varying vec3 vColour;
varying vec3 direction;
varying vec3 vNormal;

void main() {
  vec3 transformedPosition = position * positionTransform;
  vNormal = normalize(normal * positionTransform);
  transformedPosition.z += viewportZ;
  transformedPosition.xy = vec2(transformedPosition.x * scale.x, transformedPosition.y * scale.y) / transformedPosition.z;
  direction = normalize(vec3(transformedPosition.xy, 1.0));

  gl_Position = vec4(transformedPosition.xy, -0.5 / transformedPosition.z, 1.0);
  vColour = colour;
}`;

const fragmentShaderCode = `
precision mediump float;

varying vec3 vColour;
varying vec3 direction;
varying vec3 vNormal;

void main() {
	vec3 normalizedDirection = normalize(direction);
	vec3 normalizedNormal = normalize(vNormal);
	float dotResult = 0.2 + 0.8 * clamp(abs(dot(normalizedDirection, normalizedNormal)), 0.0, 1.0);
	gl_FragColor = vec4(vColour * dotResult, 1.0);
}`;