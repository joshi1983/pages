import { PushFromStackInstruction } from '../../execution/instructions/PushFromStackInstruction.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';
import { reindexJumpIndexes } from './reindexJumpIndexes.js';
import { shouldValueBeCloned } from '../shouldValueBeCloned.js';

/*
If the referenced stack items are simple pushed constants, 
this replaces the push-from-stack instruction with all the corresponding push instructions.

This can make the instructions array longer if the push-from-stack's numToPush is 3 or more.
*/
export function substitutePushFromStackConstants(instructions, index) {
	const instruction = instructions[index];
	if (!(instruction instanceof PushFromStackInstruction))
		throw new Error('index must be the index of a PushFromStackInstruction');
	const vals = [];
	for (let i = 1; i <= instruction.numToPush; i++) {
		const instruction2 = instructions[index - i];
		if (instruction2 instanceof PushInstruction)
			vals.push(instruction2.value);
		else {
			return false;
		}
	}
	const pushInstructions = vals.map(v => new PushInstruction(v, instruction.parseTreeToken, shouldValueBeCloned(v)));
	instructions.splice(index, 1, ...pushInstructions);
	// instead of the PushFromStackInstruction, every value pushed from the stack will be pushed with individual PushInstruction's.
	const reindexDelta = pushInstructions.length - 1;
	reindexJumpIndexes(instructions, index, reindexDelta);

	return true;
};