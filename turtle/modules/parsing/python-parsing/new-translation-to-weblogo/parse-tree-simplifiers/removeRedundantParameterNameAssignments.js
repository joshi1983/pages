import { filterAllBracketsAndCommas } from
'../type-processors/helpers/filterAllBracketsAndCommas.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { PythonFunctions } from
'../../PythonFunctions.js';

function isOfInterest(token) {
	if (token.val !== '=' || token.children.length !== 2)
		return false;

	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.ARGUMENT_LIST)
		return false;
	
	const firstChild = token.children[0];
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER ||
	firstChild.children.length !== 0)
		return false;

	const grandParent = parent.parentNode;
	if (grandParent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	
	let className = undefined;
	let ancestor = grandParent.parentNode;
	if (ancestor.type === ParseTreeTokenType.DOT) {
		ancestor = ancestor.parentNode;
		if (ancestor.type === ParseTreeTokenType.IDENTIFIER) {
			if (PythonFunctions.isRecognizableClassName(ancestor.val))
				className = ancestor.val;
		}
	}
	const info = PythonFunctions.getFunctionInfo(grandParent.val, className);
	if (info === undefined || info.args === undefined)
		return false;

	const args = filterAllBracketsAndCommas(parent.children);
	const index = args.indexOf(token);
	if (index < 0 || info.args.length <= index)
		return false;

	const argInfo = info.args[index];
	if (argInfo.name !== firstChild.val)
		return false;

	return true;
}

export function removeRedundantParameterNameAssignments(root) {
	const tokens = getDescendentsOfType(root, ParseTreeTokenType.ASSIGNMENT_OPERATOR).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		const firstChild = token.children[0];
		firstChild.remove();
		token.removeSingleToken();
	});
	return tokens.length !== 0;
};