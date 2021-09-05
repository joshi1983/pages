import { getCachedParseTreeFromCode } from
'../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/ParseTreeTokenType.js';
import { shouldTranslateToInternalProc } from
'../../../modules/parsing/compiling/shouldTranslateToInternalProc.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

function wrappedShouldTranslateToInternalProc(logger) {
	return function(code) {
		const tree = getCachedParseTreeFromCode(code, logger).root;
		let token = tree.children[0];
		if (token !== undefined && token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
			token = token.children[1];
		if (token === undefined)
			logger(`Expected to find a child of the parse tree but did not for code ${code}`);
		else if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			logger(`Expected to find a child of type PARAMETERIZED_GROUP but found type ` +
			`${ParseTreeTokenType.getNameFor(token.type)} for code ${code}`);
		else
			return shouldTranslateToInternalProc(token);
	};
}

export function testShouldTranslateToInternalProc(logger) {
	const cases = [
		{'in': 'map [] "sin', 'out': true},
		{'in': 'sort []', 'out': false},
		{'in': '(sort [] "greater?)', 'out': true},
		{'in': '(sorted? [] "greater?)', 'out': true},
		{'in': '(indexOfSorted 3 [] "greater?)', 'out': true},
	];
	testInOutPairs(cases, wrappedShouldTranslateToInternalProc(logger), logger);
};