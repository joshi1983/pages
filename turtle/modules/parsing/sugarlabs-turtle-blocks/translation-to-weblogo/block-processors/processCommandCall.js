import { Block } from '../../Block.js';
import { blockInfoToName } from './blockInfoToName.js';
import { Command } from '../../../Command.js';
import { processBlock } from './processBlock.js';

export function processCommandCall(block, result, settings) {
	const name = blockInfoToName(block);
	const info = Block.getBlockInfo(name);
	if (info !== undefined) {
		let startIndex = 1;
		const childIndexes = block[4];
		const map = settings.map;
		let useBrackets = [];
		if (info.migrateToCode !== undefined) {
			result.append(` ${info.migrateToCode} `);
			startIndex += info.args.length;
		}
		else if (info.removeInMigration === true) {
			startIndex += info.args.length;
		}
		else if (info.to !== undefined) {
			result.append(` ${info.to} `);
			const commandInfo = Command.getCommandInfo(info.to);
			if (commandInfo !== undefined)
				useBrackets = commandInfo.args.map(a => a.types === 'instructionlist' ||
					commandInfo.primaryName === 'ifelse' &&
					a.types === '*');
		}
		let argIndex = 0;
		for (let i = startIndex; i < childIndexes.length; i++) {
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