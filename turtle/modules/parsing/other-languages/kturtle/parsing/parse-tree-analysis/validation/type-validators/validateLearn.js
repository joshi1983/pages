import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateLearn(token, parseLogger) {
	if (token.children.length !== 3)
		parseLogger.error(`Expected 3 children of a LEARN token but found ${token.children.length}`, token);
	else {
		const nameToken = token.children[0];
		const parametersParentToken = token.children[1];
		const codeBlock = token.children[2];
		if (nameToken.type !== ParseTreeTokenType.IDENTIFIER)
			parseLogger.error(`Expected first child of LEARN to be an IDENTIFIER but got type ${ParseTreeTokenType.getNameFor(nameToken.type)}`, token);
		if (parametersParentToken.type !== ParseTreeTokenType.PARAMETERS_PARENT)
			parseLogger.error(`Expected second child of LEARN to be a PARAMETERS_PARENT but got type ${ParseTreeTokenType.getNameFor(parametersParentToken.type)}`, token);
		if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected third child of LEARN to be a CODE_BLOCK but got type ${ParseTreeTokenType.getNameFor(codeBlock.type)}`, token);
	}
};