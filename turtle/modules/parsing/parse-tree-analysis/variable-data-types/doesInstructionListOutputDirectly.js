import { isOutputOrStopToken } from '../isOutputOrStopToken.js';

export function doesInstructionListOutputDirectly(instructionListToken) {
	return instructionListToken.children.some(t => isOutputOrStopToken(t));
};