import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { switchToCodeBlock } from './switchToCodeBlock.js';

export function shouldTranslateToNothing(switchToken) {
	const codeBlock = switchToCodeBlock(switchToken);
	if (codeBlock === null)
		return true;

	if (codeBlock.children.some(t => t.type === ParseTreeTokenType.CASE || t.type === ParseTreeTokenType.DEFAULT))
		return false;

	return true;
};