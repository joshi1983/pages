import { addVariableDeclaration } from './addVariableDeclaration.js';
import { functionDefinitionTypes } from '../../../functionDefinitionTypes.js';
import { getDescendentsOfType } from
'../../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../../../SetUtils.js';

const interestingParentTypes = new Set();
SetUtils.addAll(interestingParentTypes, functionDefinitionTypes);

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