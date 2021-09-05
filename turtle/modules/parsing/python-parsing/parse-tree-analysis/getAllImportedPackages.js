import { getDescendentsOfType } from
'../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const excludedNames = new Set([
	'from'
]);

function isOfInterest(token) {
	return token.children.length !== 0;
}

export function getAllImportedPackages(root) {
	const importStatements = getDescendentsOfType(root, ParseTreeTokenType.IMPORT).filter(isOfInterest);
	const result = new Map();
	for (const importStatement of importStatements) {
		const children = importStatement.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.type === ParseTreeTokenType.IDENTIFIER && !excludedNames.has(child.val))
				result.set(child.val, child);
			if (child.type === ParseTreeTokenType.IMPORT && i !== 0)
				break;
		}
	}
	return result;
};