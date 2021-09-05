import { length } from './length.js';

const processors = [length];

export function processSpecialIdentifier(token, result, options) {
	for (const processor of processors) {
		if (processor(token, result, options))
			return true;
	}
	return false;
};