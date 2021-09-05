import { CommandCalls } from
'../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { getClosestOfType } from
'../../../../parsing/generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';

function makeToVariableName(makeToken) {
	const child = makeToken.children[0];
	if (child !== undefined)
		return child.val.toLowerCase();
}

function isOfInterest(variableAssignments) {
	if (!(variableAssignments instanceof Array))
		throw new Error(`variableAssignments must be an Array but found ${variableAssignments}`);
	const varNames = new Set(variableAssignments.map(makeToVariableName));
	return function(token) {
		const val = token.val.toLowerCase();
		if (varNames.has(val))
			return false;
		if (val !== 'true' && val !== 'false')
			return false;
		const procToken = getClosestOfType(token, ParseTreeTokenType.PROCEDURE_START_KEYWORD);
		if (procToken !== null) {
			const argList = procToken.children[1];
			for (const child of argList.children) {
				if (child.type === ParseTreeTokenType.VARIABLE_READ &&
				child.val.toLowerCase() === val)
					return false;
			}
		}
		return true;
	};
}

/*
Replaces things like :true or :False when true and false are 
not assigned a value anywhere in the program.
This is sometimes helpful when translating QBasic to WebLogo since 
some QBasic programs are written as if false and true are predefined constants.

*/
export function undefinedBooleanLiteralFixer(cachedParseTree, fixLogger) {
	const variableAssignments = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(t => CommandCalls.tokenMatchesPrimaryNames(t, ['localmake', 'make']) &&
			['false', 'true'].indexOf(makeToVariableName(t)) !== -1);
	const varReads = cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ).
		filter(isOfInterest(variableAssignments));
	varReads.forEach(function(varRead) {
		varRead.type = ParseTreeTokenType.BOOLEAN_LITERAL;
		varRead.originalString = varRead.val;
		varRead.val = varRead.val.toLowerCase() === 'true';
		cachedParseTree.tokenTypeChanged(varRead, ParseTreeTokenType.VARIABLE_READ);
		fixLogger.log(`Removed : before ${varRead.originalString} because that is how WebLogo expresses the boolean value of ${varRead.val}`, varRead);
	});
};