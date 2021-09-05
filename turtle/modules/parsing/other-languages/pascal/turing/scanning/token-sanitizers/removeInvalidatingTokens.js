import { isStringLiteralStart } from
'../isStringLiteralStart.js';

const duplicatesToRemove = new Set([
	':=', ',', ':', ';'
]);
const rightRemovablePairs = new Map([
	[':', [':=']]
]);

for (const key of rightRemovablePairs.keys()) {
	rightRemovablePairs.set(key, new Set(rightRemovablePairs.get(key)));
}

function shouldRemoveNextToken(tokens, i) {
	const token = tokens[i];
	const next = tokens[i + 1];
	if (next.s === '..' && isStringLiteralStart(token.s))
		return true;
		// For example, put "hi" ..
		// A more complete example is at:
		// https://handwiki.org/wiki/Turing_(programming_language)
		// I couldn't find documentation explaining the .. use there but maybe
		// it is to keep the cursor at the end of the line for the subsequent get statement.

	return next.s === token.s && duplicatesToRemove.has(token.s);
}

export function removeInvalidatingTokens(tokens) {
	for (let i = 0; i < tokens.length - 1; i++) {
		const token = tokens[i];
		const next = tokens[i + 1];
		if (shouldRemoveNextToken(tokens, i))
			tokens.splice(i + 1, 1);
		else {
			const info = rightRemovablePairs.get(token.s);
			if (info !== undefined && info.has(next.s)) {
				tokens.splice(i, 1);
			}
		}
	}
};