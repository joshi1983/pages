import { ParseTreeTokenType } from '../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function shouldBeProcessed(token) {
	if (token.type === ParseTreeTokenType.COMMA ||
	token.children.length === 0)
		return false;
	return true;
}

export function processDeclaration(token, result) {
	for (let i = 0; i < token.children.length; i++) {
		const child = token.children[i];
		if (shouldBeProcessed(child)) {
			if (i !== 0)
				result.append('\n');
			processToken(child, result);
		}
	}
};