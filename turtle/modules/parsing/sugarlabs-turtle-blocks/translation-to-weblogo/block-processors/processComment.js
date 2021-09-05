import { processBlock } from './processBlock.js';

export function processComment(blockInfo, result, settings) {
	const childIndexes = blockInfo[4];
	if (childIndexes instanceof Array) {
		const e = settings.map.get(childIndexes[1]);
		if (e instanceof Array) {
			const object = e[1];
			if (object[0] === 'string') {
				const s = object[1];
				const lines = s.split('\n');
				for (const line of lines) {
					result.append(` ; ${line}\n`);
				}
			}
			else
				processBlock(e, result, settings);
		}
	}
};