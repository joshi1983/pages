import { reindexJumpIndexes } from './reindexJumpIndexes.js';

/*
Removes an interval of instructions and updates any jump indexes appropriately.
*/
export function removeInstructions(instructions, startIndex, count) {
	if (count === 0)
		return; // nothing to do.
	else if (count < 0)
		throw new Error('Can not remove a negative number of elements.  count = ' + count);
	instructions.splice(startIndex, count);
	reindexJumpIndexes(instructions, startIndex + 1, -count);
};