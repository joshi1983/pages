import { getBestCaseFromTokens } from './getBestCaseFromTokens.js';

export function processTokensUsingBestCase(tokens) {
	const nameMap = new Map();
	tokens.forEach(function(token) {
		const name = token.val.toLowerCase();
		let caseTokens = nameMap.get(name);
		if (caseTokens === undefined)
			nameMap.set(name, [token]);
		else
			caseTokens.push(token);
	});
	// select best names and change all references to match.
	for (const caseTokens of nameMap.values()) {
		// which of the cases has the largest value?
		const bestCase = getBestCaseFromTokens(caseTokens);
		caseTokens.forEach(function(referenceToken) {
			referenceToken.val = bestCase;
			if (referenceToken.originalString !== undefined)
				referenceToken.originalString = bestCase;
		});
	}
};