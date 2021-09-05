import { getDescendentsOfTypes } from
'../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { getCodeUpToAndIncludingToken } from
'../../../generic-parsing-utilities/getCodeUpToAndIncludingToken.js';
import { getSortedLastDescendentTokenOf } from
'../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { getSortedLastTokenFromArray } from
'../../../generic-parsing-utilities/getSortedLastTokenFromArray.js';
import { JavaScriptInstruction } from
'../../../execution/instructions/JavaScriptInstruction.js';
import { parse } from '../../../js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../js-parsing/ParseTreeTokenType.js';

function getDeclarationsFromCode(code) {
	const parseResult = parse(code);
	// find the last declaration.
	// if there is no declaration, return ''.
	// otherwise, return all code leading up to and including the last declaration.
	const declarations = getDescendentsOfTypes(parseResult.root, [ParseTreeTokenType.CONST,
	ParseTreeTokenType.LET, ParseTreeTokenType.VAR]);
	if (declarations.length === 0)
		return '';
	const last = getSortedLastDescendentTokenOf(getSortedLastTokenFromArray(declarations));
	return getCodeUpToAndIncludingToken(code, last) + ';\n';
}

export function getDeclarationsFromInstruction(instruction) {
	if (instruction instanceof JavaScriptInstruction) {
		return getDeclarationsFromCode(instruction.code);
	}
	return '';
};