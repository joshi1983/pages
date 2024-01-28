
/*
curviness of 0.1 or 0.2 is a good default for most camera shutters.
curviness of 1 is extremely curved.  It might represent a shutter speed that is as fast as the camera can open and close.
*/
export function getBlurRatios(numSamples, curviness) {
	if (typeof numSamples !== 'number')
		throw new Error('numSamples must be a number');
	if (typeof curviness !== 'number')
		throw new Error('curviness must be a number');
	if (curviness < 0)
		throw new Error('A curviness less than 0 is completely unrealistic for any camera shutter. curviness specified as ' + curviness);
	if (numSamples === 1)
		return [1];

	const result = [];
	const ratio = 1 - 1 / (1 + numSamples);
	for (let i = 0; i < numSamples; i++) {
		const delta = (i / numSamples - 0.5) / ratio;
		result.push(Math.pow(1 - delta * delta, curviness));
	}
	return result;
};