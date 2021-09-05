import { intreal } from './intreal.js';
import { put } from './put.js';
import { quit } from './quit.js';

const nameToFunctionMap = new Map();
const processors = [
	intreal,
	put,
	quit
];
for (const processor of processors) {
	nameToFunctionMap.set(processor.name, processor);
}

export function processSpecialFunctionCall(token, result, functionInfo) {
	const process = nameToFunctionMap.get(functionInfo.primaryName.toLowerCase());
	if (process !== undefined) {
		if (false === process(token, result))
			return false;
		return true; // indicate processed.
	}
	return false;
};