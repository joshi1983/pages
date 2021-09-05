import { processBlock } from './processBlock.js';

/*
Why would anyone want a special way to run instructions in reverse?  I don't know.

Help on the corresponding block at https://turtle.sugarlabs.org/
says:
"The Backward block runs code in reverse order (Musical retrograde)"
*/
export function processBackward(block, result, settings) {
	const childIndexes = block[4];
	const map = settings.map;
	// FIXME: make this run the instructions in reverse.
	// For now, this is very similar to what processStart does.
	
	for (let i = 1; i < childIndexes.length; i++) {
		const blockInfo = map.get(childIndexes[i]);
		if (blockInfo !== undefined)
			processBlock(blockInfo, result, settings);
	}
};