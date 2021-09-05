import { getDescendentsOfType } from './getDescendentsOfType.js';

export function getUsedVariableNames(token, variableTokenType) {
	const names = getDescendentsOfType(token, variableTokenType).map(t => t.val.toLowerCase());
	return new Set(names);
};