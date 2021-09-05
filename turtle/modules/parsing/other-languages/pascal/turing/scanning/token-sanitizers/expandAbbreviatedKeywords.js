import { isIdentifier } from
'../isIdentifier.js';

function isLikelyFunctionLikeKeyword(tokens, i) {
	const next = tokens[i + 1];
	if (next === undefined)
		return false;
	else
		return isIdentifier(next.s);
}

const replacements = new Map([
	['fcn', ['function', isLikelyFunctionLikeKeyword]],
	['proc', ['procedure', isLikelyFunctionLikeKeyword]]
]);

export function expandAbbreviatedKeywords(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const s = token.s.toLowerCase();
		const replacementInfo = replacements.get(s);
		if (replacementInfo !== undefined) {
			if (replacementInfo instanceof Array) {
				if (!replacementInfo[1](tokens, i))
					continue;
			}
			token.s = replacementInfo[0];
		}
	}
};