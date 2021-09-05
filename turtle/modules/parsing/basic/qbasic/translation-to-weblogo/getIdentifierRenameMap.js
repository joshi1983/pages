import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { identifierToWebLogoIdentifier } from
'./type-processors/helpers/identifierToWebLogoIdentifier.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function getIdentifierRenameMap(root) {
	const identifiers = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER);
	const takenNames = new Set();
	const result = new Map();
	for (const id of identifiers) {
		const lowerCaseName = id.val.toLowerCase();
		if (!result.has(lowerCaseName)) {
			let newName = identifierToWebLogoIdentifier(id.val);
			const prefix = newName;
			for (let i = 1; takenNames.has(newName); i++) {
				newName = prefix + i;
			}
			result.set(lowerCaseName, newName);
			takenNames.add(lowerCaseName);
		}
	}
	return result;
};