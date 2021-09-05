import { Block } from '../../Block.js';
import { blockInfoToName } from './blockInfoToName.js';
import { processBlock } from './processBlock.js';

export function processOperator(block, result, settings) {
	const name = blockInfoToName(block);
	const info = Block.getBlockInfo(name);
	const childIndexes = block[4];
	if (childIndexes.length === 3) {
		const map = settings.map;
		const operand1 = map.get(childIndexes[1]);
		const operand2 = map.get(childIndexes[2]);
		if (operand1 !== undefined && operand2 !== undefined) {
			result.append('(');
			processBlock(operand1, result, settings);
			result.append(` ${info.migrateToOperator} `);
			processBlock(operand2, result, settings);
			result.append(')');
		}
	}
};