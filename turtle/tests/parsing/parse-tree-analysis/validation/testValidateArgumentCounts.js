import { CachedParseTree } from '../../../../modules/parsing/parse-tree-analysis/CachedParseTree.js';
import { ParseTreeToken } from '../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { processValidationTestCases } from './processValidationTestCases.js';
import { getProceduresMap } from '../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';
import { validateArgumentCounts } from '../../../../modules/parsing/parse-tree-analysis/validation/validateArgumentCounts.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testValidateArgumentCountsReturnsFalseProperly(logger) {
	const cases = [
		// These expressions should make a warning but not an error and only with other
		// validation checks such as validateIndependentlyUseful.
		{'code': '', 'error': false},
		{'code': 'fd 1', 'error': false},
		{'code': 'make "dx 1 make "dy 2 if or (not :dx=:dy) (not :dx=0) []', 'error': false},
		{'code': 'if 1<2 []', 'error': false},
		{'code': 'print (sum 1 2 3 4)', 'error': false},
		{'code': 'print quotient 1 2', 'error': false},
		{'code': 'print (quotient 1)', 'error': false}, // 1 argument is ok.
		{'code': 'print (quotient)', 'error': true}, // 0 is less than the minimum 1 argument.
		{'code': 'print (quotient 1 2 3)', 'error': true}, // more than quotient's max of 2 arguments
		{'code': `to p
	if or 4 < ascii "A 4 > ascii "Z [
	]
end`, 'error': false}
];

	processValidationTestCases(cases, logger, validateArgumentCounts);
}

function testArgCountReturnsTrueProperly(logger) {
	/*
	Since validateArgumentCounts is only a back up in case parsing doesn't already catch it, 
	we need to create a parse tree without parsing.
	In other words, LogoParser.getParseTree should log an error before the validation step 
	starts so we need to create the parse tree without parsing.
	*/
	const root = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	const fdCall = new ParseTreeToken('fd', null, 1, 0, ParseTreeTokenType.PARAMETERIZED_GROUP);
	root.appendChild(fdCall);
	function noop() {
	}
	const parseLogger = new TestParseLogger(noop, 'fd');
	const procedures = getProceduresMap(root);
	const initialVariablesMap = new Map();
	validateArgumentCounts(new CachedParseTree(root, procedures, initialVariablesMap), parseLogger, new Map());
	if (!parseLogger.hasLoggedErrors())
		logger('Expected an error but got none.  The code "fd" should require 1 argument and the validator should have logged an error to that effect.');
}

export function testValidateArgumentCounts(logger) {
	wrapAndCall([
		testArgCountReturnsTrueProperly,
		testValidateArgumentCountsReturnsFalseProperly
	], logger);
};