import { getTokenValueAdvanced } from
'../../getTokenValueAdvanced.js';
import { Variables } from
'../../Variables.js';

export function propogateTokenValuesWithTokenEqualities(
tokenValues, tokenEqualities) {
	let continueLooping;
	let i = 0;
	const emptyVariables = new Variables();
	const maxIterations = 5;
		// This is to guard against potential infinite loops.
	do {
		continueLooping = false;
		const tokensToAdvanceCheck = [];
		for (const [fromToken, toTokens] of tokenEqualities) {
			const fromVal = tokenValues.get(fromToken);
			if (fromVal !== undefined) {
				for (const toToken of toTokens) {
					const currentVal = tokenValues.get(toToken);
					if (currentVal === undefined) {
						tokenValues.set(toToken, fromVal);
						const parent = toToken.parentNode;
						if (parent.children.every(c => tokenValues.has(c)))
							tokensToAdvanceCheck.push(parent);
						continueLooping = true;
					}
				}
			}
		}
		for (const token of tokensToAdvanceCheck) {
			const val = getTokenValueAdvanced(token, tokenValues, emptyVariables);
			if (val !== undefined) {
				tokenValues.set(token, val);
				const parent = token.parentNode;
				if (parent.children.every(c => tokenValues.has(c)))
					tokensToAdvanceCheck.push(parent);
			}
		}
		i++;
	} while (continueLooping && i < maxIterations);
};