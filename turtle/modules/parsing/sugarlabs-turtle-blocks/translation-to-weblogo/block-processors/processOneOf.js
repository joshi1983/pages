import { Block } from '../../Block.js';
import { blockInfoToName } from './blockInfoToName.js';
import { processBlock } from './processBlock.js';

export function processOneOf(block, result, settings) {
	const childIndexes = block[4];
	if (childIndexes.length === 3) {
		const map = settings.map;
		const param1 = map.get(childIndexes[1]);
		const param2 = map.get(childIndexes[2]);
		if (param1 !== undefined && param2 !== undefined) {
			result.append(' pick [ ');
			processBlock(param1, result, settings);
			processBlock(param2, result, settings);
			result.append(' ] ');
		}
	}
};