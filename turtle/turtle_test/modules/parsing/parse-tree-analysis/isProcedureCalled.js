import { CommandCalls } from './CommandCalls.js';

export function isProcedureCalled(tokens) {
	return tokens.some(tok => !CommandCalls.isCommandCall(tok));
};