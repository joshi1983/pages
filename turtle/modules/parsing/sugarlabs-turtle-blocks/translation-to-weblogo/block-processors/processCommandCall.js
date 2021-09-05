import { Block } from '../../Block.js';
import { blockInfoToName } from './blockInfoToName.js';
import { Command } from '../../../Command.js';
import { processBlock } from './processBlock.js';

export function processCommandCall(block, result, settings) {
	const name = blockInfoToName(block);
	const info = Block.getBlockInfo(name);
	if (info.to !== undefined) {
		result.append(` ${info.to} `);
		const childIndexes = block[4];
		const map = settings.map;
		const commandInfo = Command.getCommandInfo(info.to);
		let useBrackets = [];
		if (commandInfo !== undefined)
			useBrackets = commandInfo.args.map(a => a.types === 'instructionlist');
		let argIndex = 0;
		for (let i = 1; i < childIndexes.length; i++) {
			const e = map.get(childIndexes[i]);
			if (e !== undefined) {
				if (useBrackets[argIndex] === true)
					result.append(' [ ');
				processBlock(e, result, settings);
				if (useBrackets[argIndex] === true)
					result.append(' ] ');
				argIndex++;
			}
		}
	}
};