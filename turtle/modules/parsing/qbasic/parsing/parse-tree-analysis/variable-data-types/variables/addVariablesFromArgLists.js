import { addVariableDeclaration } from './addVariableDeclaration.js';
import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const interestingParentTypes = new Set([
	ParseTreeTokenType.DEF,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.SUB
]);

function isOfInterest(argList) {
	const parent = argList.parentNode;
	return interestingParentTypes.has(parent.type);
}

function processArgList(argList, result) {
	for (const child of argList.children) {
		if (child.type === ParseTreeTokenType.IDENTIFIER) {
			addVariableDeclaration(child, result);
		}
	}
}

export function addVariablesFromArgLists(root, result) {
	const argLists = getDescendentsOfType(root, ParseTreeTokenType.ARG_LIST).
		filter(isOfInterest);
	argLists.forEach(function(argList) {
		processArgList(argList, result);
	});
};