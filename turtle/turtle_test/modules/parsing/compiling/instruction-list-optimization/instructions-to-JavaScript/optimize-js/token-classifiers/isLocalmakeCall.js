import { tokenToCommandInfo } from './tokenToCommandInfo.js';

/*
isLocalmakeCall is similar to isLocalmakeAssignment in that both look for calls to the localmake command.
They're different in that isLocalmakeCall looks for the root FUNCTION_CALL token.
isLocalmakeAssignment checks for the string literal token for the variable name.
*/
export function isLocalmakeCall(token) {
	const info = tokenToCommandInfo(token);
	return info !== undefined && info.primaryName === 'localmake';
};