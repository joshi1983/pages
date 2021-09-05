import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { forToCodeBlock } from './forToCodeBlock.js';
import { logicallyNegate } from '../../simplifiers/logicallyNegate.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';
import { processTokens } from '../helpers/processTokens.js';

function codeBlockToTrailingIfToken(codeBlock) {
	const children = codeBlock.children;
	for (let i = children.length - 1; i >= 0; i--) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.IF)
			return child;
		if (child.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET)
			return;
	}
}

export function shouldTranslateToDoWhile(forToken) {
	if (forToken.children.length !== 1)
		return false;
	const codeBlock = forToCodeBlock(forToken);
	if (codeBlock === undefined)
		return false;
	const ifToken = codeBlockToTrailingIfToken(codeBlock);
	if (ifToken === undefined || ifToken.children.length !== 2)
		return false;
	const ifCodeBlock = ifToken.children[1];
	if (ifCodeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;

	// does ifCodeBlock start with a break?
	for (let i = 0; i < 2; i++) {
		const child = ifCodeBlock.children[i];
		if (child === undefined)
			break;
		if (child.type === ParseTreeTokenType.BREAK)
			return true;
		if (child.type !== ParseTreeTokenType.CURLY_LEFT_BRACKET)
			return false;
	}
	return false;
};

export function translateToDoWhile(forToken, result, settings) {
	const codeBlock = forToCodeBlock(forToken);
	const ifToken = codeBlockToTrailingIfToken(codeBlock);
	const conditionToken = ifToken.children[0];

	result.append('\ndo.while [\n');
	processTokens(filterBracketsAndCommas(codeBlock.children).filter(tok => tok !== ifToken), result, settings);

	result.append('\n] ');
	logicallyNegate(conditionToken);
	processToken(conditionToken, result, settings);
	logicallyNegate(ifToken.children[0]); 
		// revert the if-statement's condition back to the old state because 
		// we want to minimize mutations of the tree while translating.
	
	result.append('\n');
};