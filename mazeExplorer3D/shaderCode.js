const vertexShaderCode = `
precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec3 colour;
attribute vec2 textureCoordinates;
uniform mat3 positionTransform;
uniform vec3 viewpoint;
uniform vec2 scale;

varying vec3 vColour;
varying float z;
varying vec2 vTextureCoordinates;

void main() {
  vec3 transformedPosition = positionTransform * (position - viewpoint);
  z = transformedPosition.z * 10.0;
  transformedPosition.xy = vec2(transformedPosition.x * scale.x, transformedPosition.y * scale.y);
  gl_Position = vec4(transformedPosition.xy, transformedPosition.z * transformedPosition.z, transformedPosition.z);
  vColour = colour;
  vTextureCoordinates = textureCoordinates;
}`;

const fragmentShaderCode = `
precision mediump float;

varying vec3 vColour;
varying float z;
varying vec2 vTextureCoordinates;
uniform sampler2D wallSampler;

void main() {
	vec3 colour = vColour;
	if (vColour.b > 0.8) {
		vec2 coords = vTextureCoordinates;
		coords.x = mod(coords.x, 1.0);
		coords.y = mod(coords.y, 1.0);
		colour = texture2D(wallSampler, coords).rgb;
	}
	gl_FragColor = vec4(colour * clamp(1.0 - z, 0.2, 0.8), 1.0);
}`;