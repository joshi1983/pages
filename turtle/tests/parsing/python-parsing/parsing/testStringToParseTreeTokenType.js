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
	{'in': 'def', 'out': ParseTreeTokenType.DEF},
	{'in': ':', 'out': ParseTreeTokenType.COLON},
	{'in': ';', 'out': ParseTreeTokenType.SEMICOLON},
	{'in': 'b', 'out': ParseTreeTokenType.IDENTIFIER},
	{'in': 'b""', 'out': ParseTreeTokenType.BYTES_LITERAL},
	{'in': '""', 'out': ParseTreeTokenType.STRING_LITERAL},
	{'in': '1', 'out': ParseTreeTokenType.NUMBER_LITERAL},
	{'in': '\t', 'out': ParseTreeTokenType.INDENT},
	{'in': 'return', 'out': ParseTreeTokenType.RETURN},
	{'in': 'None', 'out': ParseTreeTokenType.NONE},
	{'in': 'True', 'out': ParseTreeTokenType.BOOLEAN_LITERAL},
	{'in': 'try', 'out': ParseTreeTokenType.TRY},
	];
	testInOutPairs(cases, stringToParseTreeTokenType, logger);
}

export function testStringToParseTreeTokenType(logger) {
	wrapAndCall([
		testAlwaysReturnInt,
		testSpecificOutputs
	], logger);
};