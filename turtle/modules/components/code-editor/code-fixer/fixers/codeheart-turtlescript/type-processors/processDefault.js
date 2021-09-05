import { ParseTreeTokenType } from
'../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processInGeneral } from './processInGeneral.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';

export function processDefault(token, result) {
	if (token.children.length === 2 &&
	token.children[0].type === ParseTreeTokenType.COLON) {
		const block = token.children[1];
		if (block.type === ParseTreeTokenType.CODE_BLOCK)
			processTokens(block.children, result);
		else
			processToken(block, result);
	}
	else {
		processInGeneral(token, result);
	}
};