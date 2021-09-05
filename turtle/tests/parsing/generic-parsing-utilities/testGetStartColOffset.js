import { findScanToken } from
'../../helpers/findScanToken.js';
import { findToken } from
'../../helpers/findToken.js';
import { getAllDescendentsAsArray } from
'../../../modules/parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getCachedParseTreeFromCode } from
'../../helpers/getCachedParseTreeFromCode.js';
import { getStartColOffset } from
'../../../modules/parsing/generic-parsing-utilities/getStartColOffset.js';
import { LogoScanner } from
'../../../modules/parsing/LogoScanner.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

function testWithParseTreeTokens(logger) {
	const cases = [
	{'code': 'fd 100', 'token': {'val': 100}, 'out': 3},
	{'code': 'print "hi', 'token': {'val': 'hi'}, 'out': 6},
	{'code': 'print \'hi\'', 'token': {'val': 'hi'}, 'out': 6},
	{'code': 'print \'hi\nworld\'', 'token': {'val': 'hi\nworld'}, 'out': 6},
	{'code': 'print \'hi', 'token': {'val': 'hi'}, 'out': 6},
	{'code': 'print (12)',
	'token': {'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
	'out': 6},
	{'code': 'print [12]',
	'token': {'type': ParseTreeTokenType.LIST},
	'out': 6},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger).root;
		const allTokens = getAllDescendentsAsArray(tree);
		const token = findToken(caseInfo.token, allTokens, plogger);
		if (token !== undefined) {
			const result = getStartColOffset(token, caseInfo.code.split('\n'));
			if (caseInfo.out !== result)
				plogger(`Expected ${caseInfo.out} but found ${result}`);
		}
	});
}

function testWithScanTokens(logger) {
	const cases = [
	{'code': 'fd 100', 'token': {'s': '100'}, 'out': 3},
	{'code': 'print "hi', 'token': {'s': '"hi'}, 'out': 6},
	{'code': 'print \'hi\'', 'token': {'s': '\'hi\''}, 'out': 6},
	{'code': 'print \'hi\nworld\'', 'token': {'s': '\'hi\nworld\''}, 'out': 6},
	{'code': 'print \'hi', 'token': {'s': '\'hi'}, 'out': 6},
	{'code': 'print (3)', 'token': {'s': '('}, 'out': 6},
	{'code': 'print (animation.time * 1000) - :start', 'token': {'s': 'animation.time'}, 'out': 7},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const scanTokens = LogoScanner.scan(caseInfo.code);
		const token = findScanToken(caseInfo.token, scanTokens, plogger);
		if (token !== undefined) {
			const result = getStartColOffset(token, caseInfo.code.split('\n'));
			if (caseInfo.out !== result)
				plogger(`Expected ${caseInfo.out} but found ${result}`);
		}
	});
}

export function testGetStartColOffset(logger) {
	wrapAndCall([
		testWithParseTreeTokens,
		testWithScanTokens
	], logger);
};