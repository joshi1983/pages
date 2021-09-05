import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { isPenSizeAlwaysZeroAtToken } from '../../../modules/parsing/parse-tree-analysis/isPenSizeAlwaysZeroAtToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testIsPenSizeAlwaysZeroAtToken(logger) {
	const cases = [
		{ 'code': 'X', 'result': false},
		{ 'code': 'setPenSize 1 X', 'result': false},
		{ 'code': 'setPenSize 1\nmake "x 0\nX', 'result': false},
		{ 'code': 'setPenSize 0 X', 'result': true},
		{ 'code': 'setPenSize 0 penNormal X', 'result': false},
		{ 'code': 'setPenSize 0 pennormal X', 'result': false},
		{ 'code': 'make "oldState turtleState\nsetPenSize 0 setTurtleState :oldState X', 'result': false},
		{ 'code': 'setPenSize 0\nmake "x 0\nX', 'result': true},
		{ 'code': 'setPenSize 0\nto p\nX\nend\nsetPenSize 1\np', 'result': false},
		{ 'code': 'to p\nsetPenSize 0\nX\nend\nsetPenSize 1\np', 'result': true},
		{ 'code': 'repeat 10 [\nsetPenSize 0\nmake "x 0\nX]', 'result': true},
		{ 'code': 'setPenSize 0\nto p\nsetPenSize 1\nend\nX', 'result': true},
		{ 'code': 'setPenSize 1\nto p\nsetPenSize 0\nend\nX', 'result': false},
		{ 'code': 'setPenSize 0\nto p\nsetPenSize 1\nend\np\nX', 'result': false},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const tokens = tree.getAllTokens();
		const tokenToTest = findToken({'val': 'X', 'type': ParseTreeTokenType.LEAF}, tokens, plogger);
		const result = isPenSizeAlwaysZeroAtToken(tokenToTest, tree);
		if (result !== caseInfo.result)
			plogger(`Expected ${caseInfo.result} but got ${result}`);
	});
};