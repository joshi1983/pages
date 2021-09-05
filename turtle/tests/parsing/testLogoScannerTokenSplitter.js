import { Token } from '../../modules/parsing/Token.js';
import { LogoScannerTokenSplitter } from '../../modules/parsing/LogoScannerTokenSplitter.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
await LogoScannerTokenSplitter.asyncInit();

function testSpecialCases(logger) {
	const cases = [
	{'s': '<>true', 'colIndex': 6, 'tokens': [
		{'s': '<>', 'colIndex': 2},
		{'s': 'true', 'colIndex': 6}
	]},
	{'s': '<>12', 'colIndex': 4, 'tokens': [
		{'s': '<>', 'colIndex': 2},
		{'s': '12', 'colIndex': 4}
	]},
	{
		's': '"+z', 'colIndex': 3, 'tokens': [
			{'s': '"+z', 'colIndex': 3}
		]
	},
	{
		's': '"***', 'colIndex': 4, 'tokens': [
			{'s': '"***', 'colIndex': 4}
		]
	}
	];
	cases.forEach(function(caseInfo) {
		const token = new Token(caseInfo.s, caseInfo.colIndex, 0);
		const prefixLogger = prefixWrapper('Failure while processing token ' + caseInfo.s + ' with colIndex ' + caseInfo.colIndex, logger);
		const actualTokens = LogoScannerTokenSplitter.splitSingleTokenAroundOperators(token);
		if (actualTokens.length !== caseInfo.tokens.length)
			prefixLogger('Expected ' + caseInfo.tokens.length + ' tokens but got ' + actualTokens.length);
		else {
			for (let i = 0; i < actualTokens.length; i++) {
				const actualTok = actualTokens[i];
				const tok = caseInfo.tokens[i];
				if (actualTok.s !== tok.s)
					prefixLogger('Expected token s of ' + tok.s + ' but got ' + actualTok.s);
				if (actualTok.colIndex !== tok.colIndex)
					prefixLogger('Expected colIndex of ' + tok.colIndex + ' but got ' + actualTok.colIndex);
			}
		}
	});
}

function testHighLevelCases(logger) {
	// None of these cases contain whitespaces because the LogoScanner processes whitespaces.
	const cases = [
	{'code': '1', 'tokens': [
		{'s': '1', 'colIndex': 0}
	]},
	{'code': '3.14', 'tokens': [
		{'s': '3.14', 'colIndex': 3}
	]},
	{'code': '+1', 'tokens': [
		{'s': '+1', 'colIndex': 1}
	]},
	{'code': '-1', 'tokens': ['-1']},
	{'code': '-.1', 'tokens': [
		{'s': '-.1', 'colIndex': 2}
	]},
	{'code': '+.1', 'tokens': [
		{'s': '+.1', 'colIndex': 2}
	]},
	{'code': '3+1', 'tokens': [
		{'s': '3', 'colIndex': 0},
		{'s': '+', 'colIndex': 1},
		{'s': '1', 'colIndex': 2}
	]},
	{'code': '3*1', 'tokens': [
		{'s': '3', 'colIndex': 0},
		{'s': '*', 'colIndex': 1},
		{'s': '1', 'colIndex': 2}
	]},
	{'code': '*1', 'tokens': [
		{'s': '*', 'colIndex': 0},
		{'s': '1', 'colIndex': 1}
	]},
	{'code': '3*', 'tokens': [
		{'s': '3', 'colIndex': 0},
		{'s': '*', 'colIndex': 1}
	]},
	{'code': '-3.14', 'tokens': [
		{'s': '-3.14', 'colIndex': 4}
	]},
	{'code': '-1-1', 'tokens': [
		{'s': '-1', 'colIndex': 1},
		{'s': '-', 'colIndex': 2},
		{'s': '1', 'colIndex': 3}
	]},
	{'code': '+1-1', 'tokens': [
		{'s': '+1', 'colIndex': 1},
		{'s': '-', 'colIndex': 2},
		{'s': '1', 'colIndex': 3}
	]},
	{'code': '3.14-1', 'tokens': [
		{'s': '3.14', 'colIndex': 3},
		{'s': '-', 'colIndex': 4},
		{'s': '1', 'colIndex': 5}
	]},
	{'code': '3.14+1', 'tokens': ['3.14', '+', '1']},
	{'code': '-3.14+1', 'tokens': ['-3.14', '+', '1']},
	{'code': '-3.14++1', 'tokens': ['-3.14', '+', '+1']},
	{'code': '-3.14+-1', 'tokens': ['-3.14', '+', '-1']},
	{'code': '-3.14++1.1', 'tokens': ['-3.14', '+', '+1.1']},
	{'code': '-3.14+-1.1', 'tokens': ['-3.14', '+', '-1.1']},
	{'code': 'fd1r', 'tokens': [
		{'s': 'fd1r', 'colIndex': 3}
	]},
	{'code': ';hello=world', 'tokens': [';hello=world']},
	{'code': ';hello*world', 'tokens': [';hello*world']},
	{'code': ';hello/world', 'tokens': [
		{'s': ';hello/world', 'colIndex': 11}
	]},
	{'code': '-200', 'tokens': [
		{'s': '-200', 'colIndex': 3}
	]},
	{'code': '1<>true', 'tokens': [
		{'s': '1', 'colIndex': 0},
		{'s': '<>', 'colIndex': 2},
		{'s': 'true', 'colIndex': 6}
	]},
	{'code': '1<>12', 'tokens': [
		{'s': '1', 'colIndex': 0},
		{'s': '<>', 'colIndex': 2},
		{'s': '12', 'colIndex': 4}
	]},
	{
		'code': '-:x', 'tokens': [
			{'s': '-', 'colIndex': 0},
			{'s': ':x', 'colIndex': 2}
		]
	},
	{
		'code': '-:xyz', 'tokens': [
			{'s': '-', 'colIndex': 0},
			{'s': ':xyz', 'colIndex': 4}
		]
	},
	{
		'code': 'empty?', 'tokens': [
			{'s': 'empty?', 'colIndex': 5}
		]
	},
	{
		'code': 'Proc1"reD"grEen', 'tokens': [
			{'s': 'Proc1', 'colIndex': 4},
			{'s': '"reD', 'colIndex': 8},
			{'s': '"grEen', 'colIndex': 14}
		]
	},
	{
		'code': '"reD', 'tokens': [
			{'s': '"reD', 'colIndex': 3}
		]
	},
	{
		'code': '+=', 'tokens': [
			{'s': '+', 'colIndex': 0},
			{'s': '=', 'colIndex': 1}
		]
	},
	{
		'code': '0.23.5',
		// not a valid number literal but also should not be split.
		// keeping it together helps report better messages during parse tree analysis.
		'tokens': [
			{'s': '0.23.5', 'colIndex': 5}
		]
	},
	{
		'code': '123h',
		// not a valid number literal but also should not be split.
		// keeping it together helps report better messages during parse tree analysis.
		'tokens': [
			{'s': '123h', 'colIndex': 3}
		]
	},
	{
		'code': '1e1',
		'tokens': [
			{'s': '1e1', 'colIndex': 2}
		]
	},
	{
		'code': '1e-1',
		'tokens': [
			{'s': '1e-1', 'colIndex': 3}
		]
	},
	];
	cases.forEach(function(caseInfo, index) {
		const token = new Token(caseInfo.code, caseInfo.code.length - 1, 0);
		const prefixLogger = prefixWrapper(`Case ${index}, code ${caseInfo.code}`, logger);
		try {
			const actualTokens = LogoScannerTokenSplitter.sanitizeTokens(LogoScannerTokenSplitter.splitSingleTokenAroundOperators(token));
			const actualTokenStrings = actualTokens.map((tok) => tok.s);
			if (actualTokens.length !== caseInfo.tokens.length)
				prefixLogger('Expected ' + caseInfo.tokens.length + ' tokens but got ' + actualTokens.length + ' and they are ' + JSON.stringify(actualTokenStrings));
			else {
				for (let i = 0; i < actualTokens.length; i++) {
					const actualTok = actualTokens[i];
					const tok = caseInfo.tokens[i];
					const s = typeof tok === 'object' ? tok.s : tok;
					if (actualTok.s !== s)
						prefixLogger('Expected token ' + s + ' but got ' + actualTok.s);
					if (typeof tok === 'object' && tok.colIndex !== actualTok.colIndex)
						prefixLogger('Expected colIndex of ' + tok.colIndex + ' but got ' + actualTok.colIndex + ' for token with s of ' + tok.s);
				}
			}
		}
		catch (e) {
			console.error(e);
			prefixLogger('Error thrown with message ' + e);
		}
	});
}

function testSplitSingleTokenAroundQuotes(logger) {
	const cases = [
		{'s': '"', 'tokens': [ // represents empty string in a word
			{'s': '"', 'colIndex': 0}
		]},
		{'s': 'forward', 'tokens': [
			{'s': 'forward', 'colIndex': 6}
		]},
		{'s': '"rEd', 'tokens': [
			{'s': '"rEd', 'colIndex': 3}
		]},
		{'s': 'setpencolor"red', 'tokens': [
			{'s': 'setpencolor', 'colIndex': 10}, 
			{'s': '"red', 'colIndex': 14}
		]},
		{'s': 'Proc1"reD"grEen', 'tokens': [
			{'s': 'Proc1', 'colIndex': 4}, 
			{'s': '"reD', 'colIndex': 8},
			{'s': '"grEen', 'colIndex': 14}
		]}
	];
	cases.forEach(function(caseInfo) {
		for (let lineIndex = 0; lineIndex < 2; lineIndex++) {
			for (let colIndexOffset = 0; colIndexOffset < 2; colIndexOffset++) {
				const token = new Token(caseInfo.s, colIndexOffset + caseInfo.s.length - 1, lineIndex);
				const plogger = prefixWrapper('Testing failed for token with s: ' + token.s + ', colIndex ' + token.colIndex + ', lineIndex ' + token.lineIndex, logger);
				const resultTokens = LogoScannerTokenSplitter.splitSingleTokenAroundQuotes(token);
				if (!(resultTokens instanceof Array))
					plogger('Array expected but got: ' + resultTokens);
				else if (resultTokens.length !== caseInfo.tokens.length) {
					plogger('Expected ' + caseInfo.tokens.length + ' tokens but got ' + resultTokens.length);
				}
				else {
					caseInfo.tokens.forEach(function(expected, index) {
						const actualTok = resultTokens[index];
						const expectedColIndex = expected.colIndex + colIndexOffset;
						const pplogger = prefixWrapper('Testing token index ' + index, plogger);
						if (expected.s !== actualTok.s)
							pplogger('Expected s to be "' + expected.s + '" but got "' + actualTok.s + '"');
						if (expectedColIndex !== actualTok.colIndex)
							pplogger('Expected colIndex to be ' + expectedColIndex + ' but got ' + actualTok.colIndex);
						if (actualTok.lineIndex !== lineIndex)
							pplogger('Expected lineIndex to be ' + lineIndex + ' but got ' + actualTok.lineIndex);
					});
				}
			}
		}
	});
}

export function testLogoScannerTokenSplitter(logger) {
	testHighLevelCases(prefixWrapper('testHighLevelCases', logger));
	testSpecialCases(prefixWrapper('testSpecialCases', logger));
	testSplitSingleTokenAroundQuotes(prefixWrapper('testSplitSingleTokenAroundQuotes', logger));
};