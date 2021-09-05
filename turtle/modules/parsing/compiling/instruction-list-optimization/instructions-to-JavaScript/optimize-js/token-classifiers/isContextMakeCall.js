import { tokenToCommandInfo } from './tokenToCommandInfo.js';

export function isContextMakeCall(token) {
	const info = tokenToCommandInfo(token);
	return info !== undefined && info.primaryName === 'make';
};