import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { shouldTranslateToNothing } from './shouldTranslateToNothing.js';
import { shouldTranslateToDefaultOnly } from './shouldTranslateToDefaultOnly.js';
import { switchToCodeBlock } from './switchToCodeBlock.js';

export function shouldSwitchValueBeStoredInVariable(switchToken) {
	const switchValueToken = switchToken.children[0];
	if (switchValueToken === undefined)
		return false;
	if (shouldTranslateToNothing(switchToken) ||
	shouldTranslateToDefaultOnly(switchToken))
		return false;
	if (switchValueToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	switchValueToken.children.length >= 2) {
		const valToken = switchValueToken.children[1];
		if (valToken.children.length === 0)
			return false;
	}
	const codeBlock = switchToCodeBlock(switchToken);
	if (codeBlock.children.filter(t => t.type === ParseTreeTokenType.CASE).length === 1)
		return false;
	return true;
};