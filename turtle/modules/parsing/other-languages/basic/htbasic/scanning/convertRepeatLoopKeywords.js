import { mightBeLineNumber } from './mightBeLineNumber.js';
import { Token } from
'../../../../generic-parsing-utilities/Token.js';

const keywordsMap = new Map([
	['repeat', {'prevRequired': false, 'to': 'do'}],
	['until', {
		'prevRequired': true,
		'to': 'loop',
		'insertBefore': true
	}]
]);

function isOfInterest(tokens, i) {
	const token = tokens[i];
	const s = token.s.toLowerCase();
	const info = keywordsMap.get(s);
	if (info === undefined)
		return false;

	const prev = tokens[i - 1];
	if (prev === undefined) {
		if (info.prevRequired)
			return false;
	}
	else if (prev.lineIndex === token.lineIndex) {
		if (prev.s !== ':' && !mightBeLineNumber(prev.s))
			return false;
	}
	return true;
}

export function convertRepeatLoopKeywords(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (isOfInterest(tokens, i)) {
			const s = token.s.toLowerCase();
			const replacementInfo = keywordsMap.get(s);
			if (replacementInfo.insertBefore)
				tokens.splice(i, 0, new Token(replacementInfo.to,
					token.colIndex, token.lineIndex));
			else
				token.s = replacementInfo.to;
		}
	}
};