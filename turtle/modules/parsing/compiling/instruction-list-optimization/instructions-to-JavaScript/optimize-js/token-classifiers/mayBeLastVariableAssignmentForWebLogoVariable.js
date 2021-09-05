import { isAfterOrSame } from '../../../../../generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function mayBeLastVariableAssignmentForWebLogoVariable(token, webLogoVariableInfo) {
	const argList = token.parentNode;
	const webLogoVarName = argList.children[1];
	if (webLogoVarName.type !== ParseTreeTokenType.STRING_LITERAL)
		return false;
	const tokens = webLogoVariableInfo.setTokens.concat(webLogoVariableInfo.makeTokens).concat(webLogoVariableInfo.readTokens);
	for (let i = 0; i < tokens.length; i++) {
		const tok = tokens[i];
		if (token !== tok && isAfterOrSame(tok, token))
			return false;
	}
	return true;
};