import { demand } from './demand.js';
import { do_ } from './do_.js';
import { getJossName } from './getJossName.js';
import { type } from './type.js';

const nameToFunctionMap = new Map([
	['do', do_]
]);
const processors = [
	demand,
	type
];
for (const processor of processors) {
	nameToFunctionMap.set(processor.name, processor);
}

export function processSpecialFunctionCall(token, result) {
	const name = getJossName(token);
	if (typeof name === 'string') {
		const process = nameToFunctionMap.get(name.toLowerCase());
		if (process !== undefined) {
			if (false === process(token, result))
				return false;
			return true; // indicate processed.
		}
	}
	return false;
};