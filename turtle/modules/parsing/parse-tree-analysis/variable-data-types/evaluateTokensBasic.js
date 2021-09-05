import { getTokenValueAdvanced } from './getTokenValueAdvanced.js';
import { getTokenValueBasic } from './getTokenValueBasic.js';
import { shouldBeEvaluatedBasic } from './shouldBeEvaluatedBasic.js';

export function evaluateTokensBasic(cachedParseTree) {
	const result = new Map();
	let unevaluatedTokens = cachedParseTree.getAllTokens().filter(function(token) {
		if (!shouldBeEvaluatedBasic(token))
			return false;
		const basicEvaluationResult = getTokenValueBasic(token);
		if (basicEvaluationResult === undefined)
			return true;
		else {
			result.set(token, basicEvaluationResult);
			return false;
		}
	});
	let somethingEvaluated = true;
	while (somethingEvaluated) {
		somethingEvaluated = false;
		unevaluatedTokens = unevaluatedTokens.filter(t => !result.has(t));
		for (let i = 0; i < unevaluatedTokens.length; i++) {
			const tok = unevaluatedTokens[i];
			const evalResult = getTokenValueAdvanced(tok, result);
			if (evalResult !== undefined) {
				result.set(tok, evalResult);
				somethingEvaluated = true;
			}
		}
	}
	return result;
};