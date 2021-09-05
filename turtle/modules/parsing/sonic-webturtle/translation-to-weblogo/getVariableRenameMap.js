import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { sanitizeIdentifier } from '../../generic-parsing-utilities/sanitizeIdentifier.js';
import { validateIdentifier } from '../../parse-tree-analysis/validateIdentifier.js';

function getValidVariableName(varNameSeed, takenNames) {
	if (validateIdentifier(varNameSeed) === undefined)
		return varNameSeed;
	varNameSeed = sanitizeIdentifier(varNameSeed);
	if (!takenNames.has(varNameSeed.toLowerCase()))
		return varNameSeed;
	const hasQuestionMark = varNameSeed.endsWith('?');
	if (hasQuestionMark)
		varNameSeed = varNameSeed.substring(0, varNameSeed.length - 1); // remove question mark.
	for (let i = 1; true; i++) {
		let newName = varNameSeed + i;
		if (hasQuestionMark)
			newName+= '?';
		if (!takenNames.has(newName.toLowerCase()))
			return varNameSeed;
	}
}

export function getVariableRenameMap(root) {
	const varReferences = getDescendentsOfType(root, ParseTreeTokenType.VARIABLE_REFERENCE);
	const result = new Map();
	const takenNames = new Set();
	for (const varRef of varReferences) {
		const lowerCaseName = varRef.val.toLowerCase();
		if (!result.has(lowerCaseName)) {
			const toName = getValidVariableName(sanitizeIdentifier(varRef.val), takenNames);
			result.set(lowerCaseName, toName);
			takenNames.add(toName);
		}
	}
	return result;
};