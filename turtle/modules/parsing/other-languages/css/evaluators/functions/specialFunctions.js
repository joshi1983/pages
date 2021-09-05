import { isRGBWithPercentage, evaluateRGBWithPercentage } from './rgbWithPercentage.js';

const specials = new Map([
	['rgb', [isRGBWithPercentage, evaluateRGBWithPercentage]]
]);

export function needsSpecialEvaluation(name, parameterTokens) {
	const specialFuncs = specials.get(name);
	if (specialFuncs === undefined)
		return false;
	return specialFuncs[0](parameterTokens);
};

export function evaluateSpecial(name, parameterTokens) {
	const specialFuncs = specials.get(name);
	return specialFuncs[1](parameterTokens);
};