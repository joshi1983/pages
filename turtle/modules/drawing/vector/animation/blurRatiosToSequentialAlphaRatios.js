
/*
To achieve the specified motion blur blend ratios, we'll be drawing the 
canvases in sequence with various alpha blending ratios.

We need to do some math to work out the sequence of alpha ratios that will achieve the specified blur ratios.
*/
export function blurRatiosToSequentialAlphaRatios(blurRatios) {
	if (!(blurRatios instanceof Array))
		throw new Error('blurRatios must be an Array');
	if (blurRatios.length === 0)
		throw new Error('There must be at least 1 element in blurRatios');
	if (blurRatios.length === 1)
		return [1];

	// ensure the sum of all blurRatios is exactly 1.
	const sum = blurRatios.reduce((a, b) => a + b, 0);
	if (sum !== 1)
		blurRatios = blurRatios.map(a => a / sum);

	const result = [];
	let remainingRatio = 1;
	for (let i = blurRatios.length - 1; i > 0; i--) {
		const v = blurRatios[i] / remainingRatio;
		result.push(v);
		remainingRatio -= blurRatios[i];
	}
	result.push(1);
	result.reverse();
	return result;
};