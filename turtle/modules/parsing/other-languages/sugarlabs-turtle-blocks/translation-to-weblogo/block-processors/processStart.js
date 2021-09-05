import { processBlock } from './processBlock.js';

export function processStart(block, result, settings) {
	const childIndexes = block[4];
	if (childIndexes instanceof Array) {
		const map = settings.map;
		for (let i = 1; i < childIndexes.length; i++) {
			const child = settings.map.get(childIndexes[i]);
			if (child !== undefined)
				processBlock(child, result, settings);
		}
	}
};