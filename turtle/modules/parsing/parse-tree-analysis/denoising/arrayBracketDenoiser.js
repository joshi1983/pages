import { ArrayUtils } from '../../../ArrayUtils.js';
import { SetUtils } from '../../../SetUtils.js';
import { StringUtils } from '../../../StringUtils.js';

const removableSubstrings = [
'Unrecognized symbol(',
'A command or procedure should be called here but you are just writing',
'may calculate a value but does not do anything with it',
'}'
];

function isRemovable(msg) {
	if (StringUtils.containsAny(msg.msg, removableSubstrings))
		return true;
	return false;
}

function isArrayBracketMessage(msg) {
	if (msg.msg.indexOf('The { symbol is used by some versions of Logo') === -1)
		return false;
	return true;
}

export function arrayBracketDenoiser(cachedParseTree, parseMessages) {
	const bracketMessages = parseMessages.filter(isArrayBracketMessage);
	if (bracketMessages.length === 0)
		return;
	const toRemove = new Set();
	bracketMessages.forEach(function(bracketMessage) {
		const sameLineMessages = parseMessages.filter(m =>
			bracketMessages.indexOf(m) === -1 &&
			m.token.lineIndex === bracketMessage.token.lineIndex &&
			isRemovable(m));
		SetUtils.addAll(toRemove, sameLineMessages);
		if (!toRemove.has(bracketMessage)) {
			const otherSameLineBracketMessages = bracketMessages.filter(m =>
				m !== bracketMessage &&
				m.token.lineIndex === bracketMessage.token.lineIndex);
			SetUtils.addAll(toRemove, otherSameLineBracketMessages);
		}
	});
	ArrayUtils.remove(parseMessages, m => !toRemove.has(m));
};
