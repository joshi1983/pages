import { processBlock } from './processBlock.js';

export function processChildren(block, result, settings) {
	const childIndexes = block[4];
	if (childIndexes instanceof Array) {
		const map = settings.map;
		for (let i = 1; i < childIndexes.length; i++) {
			const childInfo = map.get(childIndexes[i]);
			if (childInfo !== undefined)
				processBlock(childInfo, result, settings);
		}
	}
};