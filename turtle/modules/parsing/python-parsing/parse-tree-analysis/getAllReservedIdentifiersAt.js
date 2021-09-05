import { getAllFunctionDefinitions } from './getAllFunctionDefinitions.js';
import { getFunctionDefinitionsAt } from './getFunctionDefinitionsAt.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';

const identifierTypes = new Set([
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.IDENTIFIER
]);

function getGlobalIdentifiers(cachedParseTree) {
	const result = new Set();
	const haltingTypes = new Set([
		ParseTreeTokenType.FUNCTION_DEFINITION
	]);
	addIdentifiers(cachedParseTree.root, result, haltingTypes);
	return result;
}

function addIdentifiers(token, result, haltingTypes) {
	if (haltingTypes.has(token.type))
		return;
	if (identifierTypes.has(token.type))
		result.add(token.val);
	const children = token.children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		addIdentifiers(child, result, haltingTypes);
	}
}

export function getAllReservedIdentifiersAt(token, cachedParseTree) {
	const defs = getAllFunctionDefinitions(cachedParseTree);
	const result = new Set(defs.map(def => def.name));
	const containingDefs = getFunctionDefinitionsAt(cachedParseTree, token);
	SetUtils.addAll(result, getGlobalIdentifiers(cachedParseTree));
	const emptySet = new Set();
	containingDefs.forEach(function(def) {
		addIdentifiers(def.functionRootToken, result, emptySet);
	});
	return result;
};