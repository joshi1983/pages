const vertexShaderCode = `
attribute vec2 position;
attribute vec3 colour;
varying vec3 pointColour;
uniform vec2 viewportScale;
uniform float brightness;
varying float pointSize;


void main() {
  gl_Position = vec4(position * viewportScale, 0.0, 1.0);
  pointColour = colour * brightness;
  float maxBrightness = max(pointColour.r, max(pointColour.g, pointColour.b));
  pointColour *= 1.5 / maxBrightness;
  pointColour = mix(pointColour, vec3(1.0, 1.0, 1.0), 0.35); 
  // mix with some white to help overlapping glare effects become more white 
  // instead of maxing out brightness with only 1 red, green, or blue component.
  
  pointSize = maxBrightness;
  gl_PointSize = pointSize;
}`;

const fragmentShaderCode = `
#define CHROMATIC_OVERFLOW_COEFFICIENT 0.8
#define LESSER_CHROMATIC_OVERFLOW_COEFFICIENT 0.5

precision mediump float;
varying vec3 pointColour;
varying float pointSize;

vec3 chromaticOverflow(vec3 c) {
	vec3 result = c;
	if (c[0] > 1.0) {
		result[1] += (c[0] - 1.0) * CHROMATIC_OVERFLOW_COEFFICIENT;
		result[2] += (c[0] - 1.0) * LESSER_CHROMATIC_OVERFLOW_COEFFICIENT;
	}
	if (c[1] > 1.0) {
		result[0] += (c[1] - 1.0) * CHROMATIC_OVERFLOW_COEFFICIENT;
		result[2] += (c[1] - 1.0) * CHROMATIC_OVERFLOW_COEFFICIENT;
	}
	if (c[2] > 1.0) {
		result[1] += (c[2] - 1.0) * CHROMATIC_OVERFLOW_COEFFICIENT;
		result[0] += (c[2] - 1.0) * LESSER_CHROMATIC_OVERFLOW_COEFFICIENT;
	}
	
	return result;
}

float getRayIntensity(vec2 displacement) {
	const float lineWidthScale = 0.25;
	const float lineWidthScale2 = 0.33;
	float result = 0.0;
	float temp = abs(displacement.x) * lineWidthScale;
	if (temp < 1.0)
		result += 1.0 - temp;
	temp = abs(displacement.y) * lineWidthScale;
	if (temp < 1.0)
		result += 1.0 - temp;
	temp = abs(displacement.y - displacement.x) * lineWidthScale2;
	if (temp < 1.0)
		result += (1.0 - temp) * lineWidthScale2;
	temp = abs(displacement.y + displacement.x) * lineWidthScale2;
	if (temp < 1.0)
		result += (1.0 - temp) * lineWidthScale2;

	return result;
}

void main() {
	vec2 d = 2.0 * gl_PointCoord - 1.0;
	float distance = length(d);
	if (distance > 1.0) {
		discard; // do not draw this pixel.
	}
	else {
		float v = getRayIntensity(d * pointSize);
		distance = pow(distance, 0.4);
		float distance2 = 1.0 - distance;
		vec3 color = chromaticOverflow(pointColour * distance2 * (0.5 + v) / (0.6 + distance));
		gl_FragColor = vec4(color, 1.0);
	}
}`;