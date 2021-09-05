import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateParametersParent(token, parseLogger) {
	token.children.forEach(function(paramToken) {
		if (paramToken.type !== ParseTreeTokenType.VARIABLE_REFERENCE &&
		paramToken.type !== ParseTreeTokenType.COMMA)
			parseLogger.error(`Expected every child of a PARAMETERS_PARENT to be a VARIABLE_REFERENCE or a COMMA but found a ${ParseTreeTokenType.getNameFor(paramToken.type)}`, token);
	});
};