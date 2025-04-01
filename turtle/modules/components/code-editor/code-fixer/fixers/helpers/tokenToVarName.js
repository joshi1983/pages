import { tokenToVarNameToken } from './tokenToVarNameToken.js';

export function tokenToVarName(token, commandInfo) {
	token = tokenToVarNameToken(token, commandInfo);
	if (token !== undefined)
		return token.val.toLowerCase();
};