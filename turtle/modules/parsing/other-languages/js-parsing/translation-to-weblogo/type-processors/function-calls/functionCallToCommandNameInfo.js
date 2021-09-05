import { argListToParameterValueTokens } from './argListToParameterValueTokens.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { tokenToCommandInfo } from './tokenToCommandInfo.js';

export function functionCallToCommandNameInfo(deepestName, token, commandsToInfo) {
	let infoValue = commandsToInfo.get(deepestName);
	if (infoValue !== undefined && infoValue.primaryName !== undefined)
		infoValue = [infoValue];
	if (infoValue !== undefined && !(infoValue instanceof Array))
		throw new Error(`Expected infoValue to be an Array but got ${infoValue}`);
	let result;
	if (infoValue !== undefined) {
		const info = tokenToCommandInfo(token, infoValue);
		if (info !== undefined) {
			if (info.toProc !== undefined)
				result = info.toProc;
			if (info.to !== undefined)
				result = info.to;
			if (info.argLengthTos instanceof Array) {
				const tokenNumArgs = argListToParameterValueTokens(token.children[1]).length;
				for (const [numArgs, name] of info.argLengthTos) {
					if (numArgs === tokenNumArgs) {
						result = name;
						break;
					}
				}
			}
		}
	}
	if (result !== undefined)
		return {'result': result};
	result = deepestName;
	let identifierToken;
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		identifierToken = token;
	else {
		identifierToken = token.children[0];
		if (identifierToken !== undefined && identifierToken.type !== ParseTreeTokenType.IDENTIFIER)
			identifierToken = identifierToken.children[0];
	}
	return {
		'result': result,
		'identifierToken': identifierToken
	};
};