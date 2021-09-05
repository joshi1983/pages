import { getStringComparisonDetails } from '../helpers/getStringComparisonDetails.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { LogoScanner } from '../../modules/parsing/LogoScanner.js';
import { getTokenIndexes, parseTreeToCodeWithComments } from '../../modules/parsing/parseTreeToCodeWithComments.js';
import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';
await LogoParser.asyncInit();
await ParseTreeToken.asyncInit();

function codeToParseTree(code, logger) {
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (parseLogger.hasLoggedErrors()) {
		logger('Unexpectedly ran into an error trying to parse: ' + code);
		return undefined;
	}
	return tree;
}

function testGetTokenIndexes(logger) {
	const cases = [
		{'code': '\nfd 100',
			'subcases': [
				{'val': 'fd', 'colIndex': 1, 'index': 2},
				{'val': 100, 'colIndex': 5, 'index': 6}
			]
		},
		{'code': 'fd 100; Hello World\n  print "Hello',
			'subcases': [
				{'val': 'fd', 'colIndex': 1, 'index': 1},
				{'val': 100, 'colIndex': 5, 'index': 5},
				{'val': 'print', 'colIndex': 6, 'lineIndex': 1, 'index': 26},
				{'val': 'Hello', 'colIndex': 13, 'lineIndex': 1, 'index': 33}
			]
		},
		{
			'code': 'make "x 0\nwhile [ :x < 3 ] [\nprint :x\nmake "x :x + 1\n]',
			'subcases': [
				{'val': 3, 'colIndex': 13, 'lineIndex': 1, 'index': 23},
				{'val': 'print', 'colIndex': 4, 'lineIndex': 2, 'index': 33},
				{'val': 1, 'colIndex': 13, 'lineIndex': 3, 'index': 51},
			]
		},
		{
			'code': '\'\n',
			'subcases': [
				{'val': '\n', 'type': ParseTreeTokenType.LONG_STRING_LITERAL, 'lineIndex': 1, 'index': 1}
			]
		},
		{
			'code': '\'hello\nend',
			'subcases': [
				{'val': 'hello\nend', 'type': ParseTreeTokenType.LONG_STRING_LITERAL, 'lineIndex': 1, 'index': 9}
			]
		}
	];
	cases.forEach(function(caseInfo) {
		const tree = codeToParseTree(caseInfo.code, logger);
		const tokens = ParseTreeToken.flatten(tree);
		const tokenIndexes = getTokenIndexes(tokens, caseInfo.code);
		caseInfo.subcases.forEach(function(subcaseInfo) {
			const token = tokens.filter(t => t.val === subcaseInfo.val)[0];
			const plogger = prefixWrapper('Case with val=' + subcaseInfo.val + ' and code="' + caseInfo.code + '"', logger);
			if (token === undefined)
				plogger('Unable to find token');
			else {
				if (subcaseInfo.colIndex !== undefined && subcaseInfo.colIndex !== token.colIndex)
					plogger('Expected token to have colIndex=' + subcaseInfo.colIndex + ' but got ' + token.colIndex);
				if (subcaseInfo.lineIndex !== undefined && subcaseInfo.lineIndex !== token.lineIndex)
					plogger('Expected token to have lineIndex=' + subcaseInfo.lineIndex + ' but got ' + token.lineIndex);
				const index = tokenIndexes.get(token);
				if (index !== subcaseInfo.index)
					plogger('Expected to find token with val ' + subcaseInfo.val + ' at index ' + subcaseInfo.index + ' but got ' + index);
			}
		});
	});
}

function testSimulateFixingWhileCondition(logger) {
	const code = 'make "x 0\nwhile [ :x < 3 ] [\nprint :x\nmake "x :x + 1\n]';
	const tree = codeToParseTree(code, logger);
	const tokens = ParseTreeToken.flatten(tree).filter(t => t.parentNode !== null);
	const whileToken = tokens.filter(t => t.val === 'while')[0];
	const loopConditionListToken = whileToken.children[0];
	const comparisonToken = loopConditionListToken.children[1];
	if (comparisonToken.val !== '<')
		logger('Expected to find comparison token but did not');
	else {
		whileToken.replaceChild(loopConditionListToken, comparisonToken);
		const expected = 'make "x 0\nwhile  :x < 3  [\nprint :x\nmake "x :x + 1\n]';
		const result = parseTreeToCodeWithComments(tree, code);
		if (result !== expected)
			logger(`Expected "${expected}" but got "${result}".  Comparison details: ${getStringComparisonDetails(result, expected)}`);
	}
}

function testUnchangedCode(logger) {
	const cases = ['', 
		'fd 100',
		'fd\n100',
		' fd 100',
		'fd 100 ',
		'print 0.000001',
		'print 0.0000001',
		'left 135h',
		'print "Hello',
		'print ["Hello \t\t\'Hello \tWorld\']',
		'print \'Hello \tWorld\'\nfd 100',
		"print 'Hello World'",
		"print \t \t'Hello World'",
		"print 'Hello World",
		"print '",
		"print\t'",
		'make "x 1 print :x',
		';Hello',
		';  Hello \tWorld',
		';Hello\nfd 100',
		'fd 100;Hello',
		'forward:x',
		'print [1 :x]',
		'make "x 0\nmake "x :x + 1',
		'setxy -0.5 * :width -:stripeOffset',
		'make "x 0\nif :x < 2 [\nprint :x\n]',
		'setProperty  :\nsetFillRadialGros pos',
		'setProperty  :\n:setFillRadialGros pos',
		'forward :size * 0.23.5',
		'print \'hello\nend',
		`'s:
; https://www.c.pdf
to nag
p`, `''s:
; https://www.c.pdf
to nag
p`];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo;
		const tree = codeToParseTree(code, logger);
		if (tree !== undefined) {
			const result = parseTreeToCodeWithComments(tree, code);
			if (result !== code)
				logger('Case ' + index + ' Expected original code.  Expected:<br>"' + code + '"<br> but got<br>"' + result + '"');
		}
	});
}

function testWithChangedToken(logger) {
	const cases = [
		{'in': 'fd 100', 'replaceVal': {'from': 'fd', 'to': 'forward'}, 'out': 'forward 100'},
		{'in': '; Hello World\nfd\t 100', 'replaceVal': {'from': 'fd', 'to': 'forward'}, 'out': '; Hello World\nforward\t 100'},
		{'in': 'fd 100', 'replaceVal': {'from': 100, 'to': 1000}, 'out': 'fd 1000'},
		{'in': 'fd 100; Hello World', 'replaceVal': {'from': 100, 'to': 1000}, 'out': 'fd 1000; Hello World'}
	];
	cases.forEach(function(caseInfo, index) {
		const tree = codeToParseTree(caseInfo.in, logger);
		const tokens = ParseTreeToken.flatten(tree);
		const plogger = prefixWrapper('Case ' + index + ', in=' + caseInfo.in, logger);
		if (caseInfo.replaceVal !== undefined) {
			const matchedTokens = tokens.filter(t => t.val === caseInfo.replaceVal.from);
			if (matchedTokens.length !== 1)
				plogger('Expected 1 matching token but got ' + matchedTokens.length + ' for replaceVal.val ' + caseInfo.replaceVal.from);
			else {
				const matchedToken = matchedTokens[0];
				matchedToken.val = caseInfo.replaceVal.to;
				const result = parseTreeToCodeWithComments(tree, caseInfo.in);
				if (result !== caseInfo.out)
					plogger(`Expected "${caseInfo.out}" but got "${result}"`);
			}
		}
	});
}

export function testParseTreeToCodeWithComments(logger) {
	wrapAndCall([
		testGetTokenIndexes,
		testSimulateFixingWhileCondition,
		testUnchangedCode,
		testWithChangedToken
	], logger);
};