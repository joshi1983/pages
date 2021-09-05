import { beginShape, isBeginShapeOfInterest } from
'./beginShape.js';
import { circle, isCircleApplicableTo } from './circle.js';
import { fillShape, isFillShapeApplicableTo } from './fillShape.js';
import { isRepeatApplicableTo, repeat } from './repeat.js';

const pairs = [
	[beginShape, isBeginShapeOfInterest],
	[circle, isCircleApplicableTo],
	[fillShape, isFillShapeApplicableTo],
	[repeat, isRepeatApplicableTo]
];
const nameToFunctionMap = new Map();
for (const [process, isApplicableTo] of pairs) {
	nameToFunctionMap.set(process.name, {
		'isApplicableTo': isApplicableTo,
		'process': process
	});
}

export function processSpecialFunctionCall(token, result, settings) {
	const nameToken = token.children[0];
	const info = nameToFunctionMap.get(nameToken.val);
	if (info !== undefined) {
		if (info.isApplicableTo !== undefined &&
		!info.isApplicableTo(token))
			return false;

		info.process(token, result, settings);
		return true; // indicate processed.
	}
	return false;
};