import { noop } from '../../../../../noop.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const typesWithBreaks = new Set([
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.SWITCH,
	ParseTreeTokenType.WHILE
]);

function tokenHasItsOwnBreaks(token) {
	return typesWithBreaks.has(token.type);
}

export function doNotTranslateBreaks(token, settings) {
	if (tokenHasItsOwnBreaks(token))
		return;
	if (token.type === ParseTreeTokenType.BREAK) {
		settings.tokenProcessors.set(token, noop);
	}
	for (const child of token.children) {
		doNotTranslateBreaks(child, settings);
	}
};