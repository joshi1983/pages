import { tokenToCommandInfo } from './tokenToCommandInfo.js';

export function isCommandCall(token) {
	return tokenToCommandInfo(token) !== undefined;
};