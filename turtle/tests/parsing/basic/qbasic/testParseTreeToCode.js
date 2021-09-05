import { parse } from
'../../../../modules/parsing/basic/qbasic/parse.js';
import { parseTreeToCode } from
'../../../../modules/parsing/basic/qbasic/parseTreeToCode.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function echoQBasicCode(code) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but found ${code}`);
	const parseResult = parse(code);
	return parseTreeToCode(parseResult.root, code);
}

function testWithVariousExamples(logger) {
	qbasicExamples.forEach(function(code, index) {
		const result = echoQBasicCode(code);
		if (typeof result !== 'string') {
			const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
			plogger(`A string is expected but found ${result}`);
		}
	});
}

function testWithSpecificOutputs(logger) {
	const cases = [
		{'in': 'for x=3 to 10\nnext x', 'changed': false},
		{'in': 'end sub', 'changed': false},
		{'in': 'end function', 'changed': false},
		{'in': 'end def', 'changed': false},
		{'in': 'goto 100', 'changed': false},
		{'in': 'screen 5', 'changed': false},
		{'in': 'print "hi"', 'changed': false},
		{'in': '100 print "hi"', 'changed': false},
	];
	testInOutPairs(cases, echoQBasicCode, logger);
}

export function testParseTreeToCode(logger) {
	wrapAndCall([
		testWithSpecificOutputs,
		testWithVariousExamples
	], logger);
};