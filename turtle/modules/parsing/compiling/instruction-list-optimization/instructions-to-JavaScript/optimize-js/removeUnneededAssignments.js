import { declaringTypes } from '../../../../js-parsing/parsing/declaringTypes.js';
import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getDescendentsOfType } from '../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from '../../../../js-parsing/parse.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';

function isOfInterest(token) {
	if (token.children.length !== 2 || token.val !== '=')
		return false;
	const leftChild = token.children[0];
	if (leftChild.type !== ParseTreeTokenType.IDENTIFIER || leftChild.children.length !== 0)
		return false;
	const rightChild = token.children[1];
	if (rightChild.type !== ParseTreeTokenType.IDENTIFIER || rightChild.val !== leftChild.val || rightChild.children.length !== 0)
		return false;
	const parent = token.parentNode;
	if (declaringTypes.has(parent.type))
		return false;
	return true;
}

export function removeUnneededAssignments(jsCode) {
	const parseResult = parse(jsCode);
	const assignments = getDescendentsOfType(parseResult.root, ParseTreeTokenType.ASSIGNMENT_OPERATOR).
	filter(isOfInterest);
	if (assignments.length === 0)
		return jsCode;
	assignments.forEach(function(token) {
		const parent = token.parentNode;
		const children = parent.children;
		let index = children.indexOf(token) + 1;
		// remove unneeded semicolons after the removed token just because it is easy.
		while (index < children.length && children[index].type === ParseTreeTokenType.SEMICOLON)
			children[index].remove();

		token.remove(); // remove the unneeded assignment
	});
	return parseTreeTokensToCode(flatten(parseResult.root));
};