import { Command } from '../Command.js';
import { CommandCalls } from './CommandCalls.js';
await Command.asyncInit();

const loopCommandNames = Command.getCommandsMatchingSearchKeywords(["loop"]).
	filter(info => info.primaryName !== 'repcount').
	map(info => info.primaryName);
export function isLoop(token) {
	return CommandCalls.tokenMatchesPrimaryNames(token, loopCommandNames);
};

export { loopCommandNames }; // exported only for testing purposes.