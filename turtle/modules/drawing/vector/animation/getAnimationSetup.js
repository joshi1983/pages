import { clamp } from '../../../clamp.js';
import { executeLogoProcedure } from '../../../parsing/execution/executeLogoProcedure.js';
import { isNumber } from '../../../isNumber.js';

const defaultDuration = 10;
const defaultThumbnailTime = 0;

function createDefaultResult() {
	const result = new Map();
	result.set('duration', defaultDuration);
	result.set('thumbnailTime', defaultThumbnailTime);
	return result;
}

export function getAnimationSetup(program) {
	if (!program.procedures.has('animation.setup'))
		return new Promise(resolve => resolve(createDefaultResult()));
	return executeLogoProcedure(program, 'animation.setup').then(function(result) {
		const sanitizedResult = new Map();
		let resultAnimationDuration;
		let thumbnailTime;
		if (!(result instanceof Map) || !result.has('duration') || !isNumber(result.get('duration')) || result.get('duration') < 0.0001)
			resultAnimationDuration = defaultDuration;
		else
			resultAnimationDuration = result.get('duration');
		if (!(result instanceof Map) || !result.has('thumbnailTime') || !isNumber(result.get('thumbnailTime')) || result.get('thumbnailTime') < 0)
			thumbnailTime = defaultThumbnailTime;
		else
			thumbnailTime = result.get('thumbnailTime');
		thumbnailTime = clamp(thumbnailTime, 0, resultAnimationDuration);
		sanitizedResult.set('duration', resultAnimationDuration);
		sanitizedResult.set('thumbnailTime', thumbnailTime);
		return sanitizedResult;
	});
};