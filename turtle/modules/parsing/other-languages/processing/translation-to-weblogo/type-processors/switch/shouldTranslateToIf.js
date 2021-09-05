import { isNonemptyCase } from './isNonemptyCase.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { switchToCodeBlock } from './switchToCodeBlock.js';

export function shouldTranslateToIf(switchToken) {
	const codeBlock = switchToCodeBlock(switchToken);
	if (codeBlock === null)
		return false;

	const cases = codeBlock.children.filter(t => isNonemptyCase(t));
	if (cases.length !== 1)
		return false;

	if (codeBlock.children.some(t => t.type === ParseTreeTokenType.DEFAULT))
		return false;

	return true;
};