import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { numberNames } from
'../parsing/parse-tree-analysis/variable-data-types/numberNames.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { SetUtils } from '../../../../SetUtils.js';

const builtInNames = new Set([
	'string'
]);
SetUtils.addAll(builtInNames, numberNames);

const nonTypeParentTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.ASSIGNMENT,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.TYPE,
]);

function mightBeReferenced(allIdentifiers) {
	return function(typeToken) {
		const children = typeToken.children;
		if (children.length === 0)
			return false;

		const firstChild = children[0];
		if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
			return false;

		let name = firstChild.val.toLowerCase();
		return allIdentifiers.some(t => t.val.toLowerCase() === name);
	};
};

function mightBeDataTypeReference(token) {
	const name = token.val.toLowerCase();
	if (builtInNames.has(name))
		return false;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.AS)
		return true;

	return !nonTypeParentTypes.has(parent.type);
}

export function getReferencedCustomTypes(root) {
	const identifiers = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).
		filter(mightBeDataTypeReference);
	const types = getDescendentsOfType(root, ParseTreeTokenType.TYPE).
		filter(mightBeReferenced(identifiers));
	return types;
};