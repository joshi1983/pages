import { getClosestOfTypes } from
'../../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { getDescendentsOfTypes } from
'../../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../../SetUtils.js';

const variableDeclarationTypes = [
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.VAR
];
const variableDeclarationTypesSet = new Set(variableDeclarationTypes);

function getIdentifiersFromDeclaration(declaration) {
	const result = [];
	if (declaration.type === ParseTreeTokenType.FUNCTION ||
	declaration.type === ParseTreeTokenType.CLASS) {
		if (declaration.children.length !== 0) {
			const first = declaration.children[0];
			if (first.type === ParseTreeTokenType.IDENTIFIER)
				result.push(first.val);
		}
	}
	else if (variableDeclarationTypesSet.has(declaration.type)) {
		for (const child of declaration.children) {
			if (child.type === ParseTreeTokenType.IDENTIFIER) {
				result.push(child.val);
			}
			else if (child.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
			child.val === '=' && child.children.length !== 0) {
				const grandChild = child.children[0];
				if (grandChild.type === ParseTreeTokenType.IDENTIFIER)
					result.push(grandChild.val);
			}
		}
	}
	return result;
}

export function validateDuplicateDeclarations(cachedParseTree, parseLogger) {
	const declarations = getDescendentsOfTypes(cachedParseTree.root, variableDeclarationTypes);
	declarations.forEach(function(declaration) {
		const identifiers = getIdentifiersFromDeclaration(declaration);
		const identifiersSet = new Set(identifiers);
		if (identifiersSet.size !== identifiers.length) {
			identifiers.sort();
			for (let i = 1; i < identifiers.length; i++) {
				const identifier = identifiers[i];
				if (identifier === identifiers[i - 1]) {
					parseLogger.error(`Duplicate declaration of ${identifier} found.`, declaration);
				}
			}
		}
		else {
			// look for clashing declarations at the same scope.
			const instructionList = getClosestOfTypes(declaration, [
				ParseTreeTokenType.CODE_BLOCK,
				ParseTreeTokenType.FOR_LOOP_SETTINGS,
				ParseTreeTokenType.TREE_ROOT
			]);
			for (const child of instructionList.children) {
				if (child !== declaration) {
					const otherIdentifiers = new Set(getIdentifiersFromDeclaration(child));
					const duplicates = SetUtils.getIntersection(identifiersSet, otherIdentifiers);
					for (const identifier of duplicates) {
						parseLogger.error(`Duplicate declaration of ${identifier} found`, declaration);
					}
				}
			}
		}
	});
};