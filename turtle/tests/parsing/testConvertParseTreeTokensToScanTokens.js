import { convertParseTreeTokensToScanTokens } from '../../modules/parsing/convertParseTreeTokensToScanTokens.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { LogoScanner } from '../../modules/parsing/LogoScanner.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

export function testConvertParseTreeTokensToScanTokens(logger) {
	const cases = [
		'',
		'fd 10',
		'print "Hello',
		"print 'hello world'",
		'print []',
		'print 1 + 4',
		'print 1 * 4',
		'print 1/4',
		'print 1 - 4',
		'print (1 - 4)',
		'print -4',
		'print 3.14',
		'print -3.14',
		'print True',
		'print true',
		'repeat 2 [\nprint "hi\n]',
		'to p\nend',
		'to p\nprint "hi\nend',
		'; comment',
		'print "hi; comment',
		'make "x 5\nprint :x',
		`to P1 :numIterations
repeat :numIterations [
	fd 10
	Right 360 / :numIterations
]
End

P1 4`
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo;
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseLogger = new TestParseLogger(logger, code);
		const scanTokens = LogoScanner.scan(code, parseLogger);
		const tree = LogoParser.getParseTree(code, parseLogger);
		const resultTokens = convertParseTreeTokensToScanTokens(tree);
		const expectedTokens = scanTokens.filter(token => !token.isComment() && token.s !== '\n');
		if (resultTokens.length !== expectedTokens.length)
			plogger(`Expected ${expectedTokens.length} but got ${resultTokens.length}.  Expected: ${JSON.stringify(expectedTokens)}.\nActual: ${JSON.stringify(resultTokens)}`);
		else {
			for (let i = 0; i < expectedTokens.length; i++) {
				const resultToken = resultTokens[i];
				const expected = expectedTokens[i];
				['s', 'colIndex', 'lineIndex'].forEach(function(key) {
					if (resultToken[key] !== expected[key])
						plogger(`Expected ${key} to be "${expected[key]}" but got "${resultToken[key]}"`);
				});
			}
		}
	});
};