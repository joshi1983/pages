import { escapeHTML } from
'../../../../helpers/escapeHTML.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
import { tightenTokenDataTypesAfterAdjustSubtypesForLists } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/tightenTokenDataTypesAfterAdjustSubtypesForLists.js';

export function testTightenTokenDataTypesAfterAdjustSubtypesForLists(logger) {
	const code = `make "points []
repeat 100 [
	queue2 "points pos
]
repeat 100 [
	make "fromPoint item repcount :points
	print round :fromPoint / 5
]`;
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const variables = cachedParseTree.getVariables();
	const tokenDataTypes = cachedParseTree.getTokensToDataTypes();
	tightenTokenDataTypesAfterAdjustSubtypesForLists(cachedParseTree, variables, tokenDataTypes);
	const itemToken = findToken({
		'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
		'val': 'item'
	}, cachedParseTree.getAllTokens(), logger);
	const pointsVariable = variables.getVariableByName('points');
	const firstScope = pointsVariable.scopes[0];
	let expectedTypes = 'list<list<num>(minlen=3)>';
	if (firstScope.assignedTypes.toString() !== expectedTypes)
		logger(escapeHTML(`Expected assignedTypes for variable points to be ${expectedTypes} but got ${firstScope.assignedTypes.toString()}`));
	const frompointVariable = variables.getVariableByName('frompoint');
	const secondScope = frompointVariable.scopes[0];
	expectedTypes = 'list<num>(minlen=3)';
	if (secondScope.assignedTypes.toString() !== expectedTypes)
		logger(escapeHTML(`Expected assignedTypes for variable frompoint to be ${expectedTypes} but got ${secondScope.assignedTypes.toString()}`));
};