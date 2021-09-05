import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processInGeneral } from './processInGeneral.js';
import { processTokens } from './helpers/processTokens.js';

export function processDefault(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result) {
		if (token.children.length === 2 &&
		token.children[0].type === ParseTreeTokenType.COLON) {
			const block = token.children[1];
			if (block.type === ParseTreeTokenType.CODE_BLOCK)
				processTokens(processToken, block.children, result);
			else
				processToken(block, result);
		}
		else {
			processInGeneral(processToken)(token, result);
		}
	};
};