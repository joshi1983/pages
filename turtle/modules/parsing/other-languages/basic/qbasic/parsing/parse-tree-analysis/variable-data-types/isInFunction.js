import { getContainingFunction } from
'./getContainingFunction.js';

export function isInFunction(token) {
	return getContainingFunction(token) !== null;
};