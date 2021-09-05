import { Block } from '../../Block.js';
import { blockInfoToName } from './blockInfoToName.js';
import { processCommandCall } from './processCommandCall.js';
import { processComment } from './processComment.js';
import { processNumber } from './processNumber.js';
import { processOperator } from './processOperator.js';
import { processStart } from './processStart.js';
import { processString } from './processString.js';

const processers = new Map();
[processComment, processNumber,
processStart, processString].
forEach(function(f) {
	let key = f.name.toLowerCase();
	if (key.startsWith('process'))
		key = key.substring('process'.length);
	processers.set(key, f);
});

export function processBlock(block, result, settings) {
	let name = blockInfoToName(block);
	const processer = processers.get(name);
	if (processer !== undefined) {
		processer(block, result, settings);
		return;
	}
	const info = Block.getBlockInfo(name);
	if (info !== undefined) {
		if (info.migrateToOperator === undefined)
			processCommandCall(block, result, settings);
		else
			processOperator(block, result, settings);
	}
};