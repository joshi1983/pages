import { MixBlendMode } from
'../../../../../modules/drawing/vector/shapes/mix-blend-modes/MixBlendMode.js';

export function testMixBlendMode(logger) {
	const name = MixBlendMode.getNameFor(0);
	if (typeof name !== 'string')
		logger(`Expected getNameFor(0) to return a string but found ${name}`);
	const names = MixBlendMode.getNames();
	if (!(names instanceof Array))
		logger(`Expected names to be an Array but found ${names}`);

	const i = MixBlendMode.parse('normal');
	if (!Number.isInteger(i))
		logger(`Expected parse('normal') to return an integer but found ${i}`);
};