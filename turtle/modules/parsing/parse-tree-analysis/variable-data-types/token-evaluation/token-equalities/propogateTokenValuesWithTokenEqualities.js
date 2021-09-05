export function propogateTokenValuesWithTokenEqualities(tokenValues, tokenEqualities) {
	let continueLooping;
	let i = 0;
	const maxIterations = 5;
		// This is to guard against potential infinite loops.
	do {
		continueLooping = false;
		for (const [fromToken, tokenValue] of tokenValues) {
			const toTokens = tokenEqualities.get(fromToken);
			if (toTokens !== undefined) {
				for (const toToken of toTokens) {
					if (!tokenValues.has(toToken)) {
						tokenValues.set(toToken, tokenValue);
						continueLooping = true;
					}
				}
			}
		}
		i++;
	} while (continueLooping && i < maxIterations);
};