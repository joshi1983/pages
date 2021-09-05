import { push } from './push.js';

const processors = [push];

export function processSpecialFunctionCall(token, result, options) {
	for (const processor of processors) {
		if (processor(token, result, options))
			return true;
	}
	return false;
};