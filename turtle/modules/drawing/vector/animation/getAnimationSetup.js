import { executeLogoProcedure } from '../../../parsing/execution/executeLogoProcedure.js';

const defaultResult = 10;

export function getAnimationSetup(program) {
	if (!program.procedures.has('animation.setup'))
		return new Promise(resolve => resolve(defaultResult));
	return executeLogoProcedure(program, 'animation.setup').then(function(animationDurationSeconds) {
		if (typeof animationDurationSeconds !== 'number' || isNaN(animationDurationSeconds) || animationDurationSeconds < 0.0001)
			return defaultResult;

		return animationDurationSeconds;
	});
};