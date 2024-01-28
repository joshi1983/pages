import { ArrayUtils } from '../../../ArrayUtils.js';
import { getTokensByType } from './getTokensByType.js';

export function getTokensByTypes(cachedParseTree, tokenTypes) {
	if (tokenTypes instanceof Array) {
		const result = [];
		for (let i = 0; i < tokenTypes.length; i++) {
			ArrayUtils.pushAll(result, getTokensByType(cachedParseTree, tokenTypes[i]));
		}
		return result;
	}
	else
		throw new Error(`tokenTypes must be an Array but got ${tokenTypes}`);
};