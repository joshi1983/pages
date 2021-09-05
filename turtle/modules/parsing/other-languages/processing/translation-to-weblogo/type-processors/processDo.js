import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processCodeBlock } from './processCodeBlock.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';

function isDoWhileLoop(children) {
	return children.length === 2 &&
		children[0].type === ParseTreeTokenType.CODE_BLOCK &&
		children[1].type === ParseTreeTokenType.WHILE &&
		children[1].children.length === 1;
}

export function processDo(token, result, settings) {
	const children = token.children;
	if (isDoWhileLoop(children)) {
		result.append('\ndo.while [\n');
		processCodeBlock(children[0], result, settings, false);
		result.append('\n] ');
		processToken(children[1].children[0], result, settings);
	}
	else {
		processTokens(children, result, settings);
	}
};