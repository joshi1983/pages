import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processCodeBlock } from './processCodeBlock.js';
import { processInGeneral } from './processInGeneral.js';

function shouldBeCodeBlock(token) {
	const prev = token.getPreviousSibling();
	if (prev === null ||
	prev.type !== ParseTreeTokenType.FUNCTION_CALL ||
	prev.children.length === 0)
		return false;
	const funcNameToken = prev.children[0];
	if (funcNameToken.children.length !== 0 ||
	funcNameToken.val !== 'repeat')
		return false;
	return true;
}

export function processCurlyBracketExpression(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);

	return function(token, result) {
		if (shouldBeCodeBlock(token)) {
			token.type = ParseTreeTokenType.CODE_BLOCK;
			processCodeBlock(processToken)(token, result);
		}
		else {
			processInGeneral(token, result);
		}
	};
};