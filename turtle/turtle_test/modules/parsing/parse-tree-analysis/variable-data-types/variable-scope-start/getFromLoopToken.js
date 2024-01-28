import { getInstructionListTokenFromLoopToken } from './getInstructionListTokenFromLoopToken.js';

export function getFromLoopToken(loopToken) {
	const instructionListToken = getInstructionListTokenFromLoopToken(loopToken);
	if (instructionListToken !== undefined && instructionListToken.children.length !== 0) {
		let resultToken = instructionListToken.children[0];
		if (resultToken.isBracket() && resultToken.nextSibling !== null)
			resultToken = resultToken.nextSibling;
		return resultToken;
	}
	return loopToken;
};