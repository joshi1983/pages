import { Block } from '../../Block.js';
import { blockInfoToName } from './blockInfoToName.js';
import { processBackward } from './processBackward.js';
import { processChildren } from './processChildren.js';
import { processCommandCall } from './processCommandCall.js';
import { processComment } from './processComment.js';
import { processFill } from './processFill.js';
import { processNumber } from './processNumber.js';
import { processOneOf } from './processOneOf.js';
import { processOperator } from './processOperator.js';
import { processStart } from './processStart.js';
import { processString } from './processString.js';

const processors = new Map([
	['oneOf', processOneOf]
]);
[processBackward, processComment, processFill, processNumber,
processStart, processString].
forEach(function(f) {
	let key = f.name.toLowerCase();
	if (key.startsWith('process'))
		key = key.substring('process'.length);
	processors.set(key, f);
});

export function processBlock(block, result, settings) {
	let name = blockInfoToName(block);
	const processor = processors.get(name);
	if (processor !== undefined) {
		processor(block, result, settings);
		return;
	}
	const info = Block.getBlockInfo(name);
	if (info !== undefined) {
		if (info.migrateToOperator === undefined)
			processCommandCall(block, result, settings);
		else
			processOperator(block, result, settings);
	}
	else {
		// This is good for when name === "hidden".
		// This is likely the best way to handle cases where name is not recognized too.
		processChildren(block, result, settings);
	}
};