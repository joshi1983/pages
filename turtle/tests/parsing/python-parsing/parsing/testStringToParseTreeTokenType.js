import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { stringToParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/parsing/stringToParseTreeTokenType.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function testAlwaysReturnInt(logger) {
	const cases = [
	'b"', 'b', 'x', 'None', 'return', 'True', 'undefined', '123', '1.0', '.'
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, s=${caseInfo}`, logger);
		const result = stringToParseTreeTokenType(caseInfo);
		if (!Number.isInteger(result))
			plogger(`Integer always expected but found ${result}`);
	});
}

function testSpecificOutputs(logger) {
	const cases = [
		{'in': 'and', 'out': ParseTreeTokenType.BINARY_OPERATOR},
		{'in': 'def', 'out': ParseTreeTokenType.DEF},
		{'in': ':', 'out': ParseTreeTokenType.COLON},
		{'in': ';', 'out': ParseTreeTokenType.SEMICOLON},
		{'in': 'b', 'out': ParseTreeTokenType.IDENTIFIER},
		{'in': 'b""', 'out': ParseTreeTokenType.BYTES_LITERAL},
		{'in': '""', 'out': ParseTreeTokenType.STRING_LITERAL},
		{'in': '""" """', 'out': ParseTreeTokenType.LONG_STRING_LITERAL},
		{'in': '\'\'\'   \'\'\'', 'out': ParseTreeTokenType.LONG_STRING_LITERAL},
		{'in': '1', 'out': ParseTreeTokenType.NUMBER_LITERAL},
		{'in': '123j', 'out': ParseTreeTokenType.NUMBER_LITERAL}, 
			// a complex number literal is a kind of number literal.

		{'in': 'j', 'out': ParseTreeTokenType.IDENTIFIER},
		{'in': '\t', 'out': ParseTreeTokenType.INDENT},
		{'in': 'return', 'out': ParseTreeTokenType.RETURN},
		{'in': 'None', 'out': ParseTreeTokenType.NONE},
		{'in': 'not', 'out': ParseTreeTokenType.UNARY_OPERATOR},
		{'in': 'or', 'out': ParseTreeTokenType.BINARY_OPERATOR},
		{'in': 'True', 'out': ParseTreeTokenType.BOOLEAN_LITERAL},
		{'in': 'try', 'out': ParseTreeTokenType.TRY},
		{'in': 'yield', 'out': ParseTreeTokenType.YIELD},
		{'in': '/', 'out': ParseTreeTokenType.BINARY_OPERATOR},
		{'in': '*', 'out': ParseTreeTokenType.BINARY_OPERATOR},
		{'in': '+', 'out': ParseTreeTokenType.BINARY_OPERATOR},
		{'in': '==', 'out': ParseTreeTokenType.BINARY_OPERATOR},
		{'in': '=', 'out': ParseTreeTokenType.ASSIGNMENT_OPERATOR},
		{'in': '+=', 'out': ParseTreeTokenType.ASSIGNMENT_OPERATOR},
		{'in': '-=', 'out': ParseTreeTokenType.ASSIGNMENT_OPERATOR}
	];
	testInOutPairs(cases, stringToParseTreeTokenType, logger);
}

export function testStringToParseTreeTokenType(logger) {
	wrapAndCall([
		testAlwaysReturnInt,
		testSpecificOutputs
	], logger);
};