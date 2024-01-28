import { Command } from '../../../Command.js';
await Command.asyncInit();

export function getInstructionListTokenFromLoopToken(loopToken) {
	const info = Command.getCommandInfo(loopToken.val);
	for (let i = 0; i < info.args.length; i++) {
		if (loopToken.children.length <= i)
			return; // indicate not found.  Avoid throwing an error.
			// analyzeCodeQuality should give the user a 
			// clear error message to fix the problem in the code.

		if (info.args[i].types === 'instructionlist')
			return loopToken.children[i];
	}
	// This is an internal problem with commands.json which must be fixed by a WebLogo developer.
	throw new Error('Unable to find instructionlist in info for command ' + info.primaryName);
};