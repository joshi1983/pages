import { getBestCase } from './getBestCase.js';

export function getBestCaseFromTokens(referenceTokens) {
	return getBestCase(referenceTokens.map(token => token.val));
};