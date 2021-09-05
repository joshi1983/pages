import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { switchToCodeBlock } from './switchToCodeBlock.js';

export function shouldTranslateToDefaultOnly(switchToken) {
	const codeBlock = switchToCodeBlock(switchToken);
	if (codeBlock === null)
		return false;

	if (codeBlock.children.some(t => t.type === ParseTreeTokenType.CASE))
		return false;

	return codeBlock.children.some(t => t.type === ParseTreeTokenType.DEFAULT);
};