import { doesTokenAlwaysOutput } from '../../../modules/parsing/parse-tree-analysis/doesTokenAlwaysOutput.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testDoesTokenAlwaysOutput(logger) {
	const code = 'to f :x\n print "x\nrepeat 5 [\noutput 2\n]\n' +
		'ifElse 1 < 2 [output 9] [output 11]\n' +
		'ifElsE 1 < 2 [print 91] [output 91]\n' + // since 1 < 2 is always true, it won't output.
		'IF true [print "hello]\n' +
		'\nif true [output 21]\n' + 
		'output 4\nend\nmake "y 32\nprint :y';
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (parseLogger.hasLoggedErrors()) {
		logger('Unexpectedly failed to parse');
		return;
	}
	const cases = [
		{
			'val': 'output',
			'firstChildVal': 4,
			'expectedResult': true
		},
		{
			'val': 'output',
			'firstChildVal': 2,
			'expectedResult': true
		},
		{
			'val': 'output',
			'firstChildVal': 9,
			'expectedResult': true
		},
		{
			'val': 'output',
			'firstChildVal': 11,
			'expectedResult': true
		},
		{
			'val': 'repeat',
			'firstChildVal': 5,
			'expectedResult': true
		},
		{
			'val': 'if',
			'firstChildVal': true,
			'expectedResult': true
		},
		{
			'val': 'IF',
			'firstChildVal': true,
			'expectedResult': false
		},
		{
			'val': 'ifElse',
			'firstChildVal': '<',
			'expectedResult': true
		},
		{
			'val': 'ifElsE',
			'firstChildVal': '<',
			'expectedResult': false
		},
		{
			'val': 'print',
			'firstChildVal': 'x',
			'expectedResult': false
		},
		{
			'val': 'print',
			'firstChildVal': 'y',
			'expectedResult': false
		},
		{
			'val': 'make',
			'firstChildVal': 'y',
			'expectedResult': false
		}
	];
	const tokens = ParseTreeToken.flatten(tree);
	cases.forEach(function(caseInfo, index) {
		const matchedTokens = tokens.filter(function(tok) {
			return tok.val === caseInfo.val && tok.children[0].val === caseInfo.firstChildVal;
		});
		if (matchedTokens.length !== 1)
			logger('Expected 1 match but got ' + matchedTokens.length + ' for test case ' + index + ', caseInfo = ' + JSON.stringify(caseInfo));
		else {
			const result = doesTokenAlwaysOutput(matchedTokens[0]);
			if (result !== caseInfo.expectedResult)
				logger('Expected result of ' + caseInfo.expectedResult + ' but got ' + result);
		}
	});
};