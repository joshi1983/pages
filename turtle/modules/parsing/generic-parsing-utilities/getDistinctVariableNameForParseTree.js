import { getUsedVariableNames } from './getUsedVariableNames.js';

export function getDistinctVariableNameForParseTree(prefix, root, variableTokenType) {
	if (typeof root !== 'object')
		throw new Error(`Expected root to be an object but got ${root}`);
	const unsafeNames = getUsedVariableNames(root, variableTokenType);
	if (!unsafeNames.has(prefix))
		return prefix;
	for (let i = 1; true; i++) {
		const newName = prefix + i;
		if (!unsafeNames.has(newName))
			return newName;
	}
};