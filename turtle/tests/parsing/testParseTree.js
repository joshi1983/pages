import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';
import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { fetchText } from '../../modules/fetchText.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

function countTopTokens(tokens) {
	var result = tokens.length;
	tokens.forEach(function(token) {
		if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
			result += token.children.length;
	});
	return result;
}

function processTestCase(caseInfo, logger) {
	const testParseLogger = new TestParseLogger(logger, caseInfo.code);
	const tree = LogoParser.getParseTree(caseInfo.code, testParseLogger);
	if (typeof tree !== 'object')
		logger('Unexpectedly failed to parse code ' + caseInfo.code);
	else {
		var tokens = tree.children;

		if (countTopTokens(tokens) !== caseInfo.numTopTokens) {
			logger('Expected ' + caseInfo.numTopTokens + ' but got ' + countTopTokens(tokens) + ' tokens. code = ' + caseInfo.code);
			console.error(tokens);
		}
		else if (caseInfo.topTypes instanceof Array) {
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i].type !== caseInfo.topTypes[i])
					logger('Expected type ' + ParseTreeTokenType.getNameFor(caseInfo.topTypes[i]) + ' but got ' + ParseTreeTokenType.getNameFor(tokens[i].type) + '.');
			}
		}
		if (typeof caseInfo.toString === 'string') {
			var actual = ParseTreeToken.arrayToString(tokens);
			if (actual !== caseInfo.toString) {
				logger('Expected toString of ' + caseInfo.toString + ' but got ' + actual + '.');
			}
		}
		if (typeof caseInfo.height === 'number') {
			var actual = ParseTreeToken.getMaxHeight(tokens);
			if (actual !== caseInfo.height) {
				logger('Expected height of ' + caseInfo.height + ' but got ' + actual);
			}
		}
		if (typeof caseInfo.totalTokens === 'number') {
			const totalTokens = ParseTreeToken.countTokens(tokens);
			if (totalTokens !== caseInfo.totalTokens)
				logger('Expected total tokens to be ' + caseInfo.totalTokens + ' but got ' + totalTokens);
		}
	}
}

function testAsyncCases(logger) {
	var cases = [
		{'codeUrl': 'drawDot3D.lgo', 'numTopTokens': 1},
		{'codeUrl': 'getPoint.lgo', 'numTopTokens': 1},
		{'codeUrl': 'nextLine3D.lgo', 'numTopTokens': 1},
		{'codeUrl': 'solarSystemSmall.lgo', 'numTopTokens': 1},
		{'codeUrl': 'solarSystem.lgo', 'numTopTokens': 1},
		{'codeUrl': 'sphere.lgo', 'numTopTokens': 1},
		{'codeUrl': 'zzz.lgo', 'numTopTokens': 1},
		{'codeUrl': 'logo-scripts/msw-logo-examples/3DBITMAP.LGO', 'numTopTokens': 8},
		{'codeUrl': 'logo-scripts/msw-logo-examples/ALGS.LGO', 'numTopTokens': 52},
		{'codeUrl': 'logo-scripts/msw-logo-examples/SOLAR.LGO', 'numTopTokens': 7},
		{'codeUrl': 'logo-scripts/msw-logo-examples/SPHERE.LGO', 'numTopTokens': 8}
	];
	cases.forEach(function(caseInfo) {
		if (caseInfo.codeUrl.indexOf('/') === -1)
			caseInfo.codeUrl = 'tests/data/' + caseInfo.codeUrl;
		fetchText(caseInfo.codeUrl).then(function(caseCode) {
			caseInfo.code = caseCode;
			processTestCase(caseInfo, function(msg) {
				logger(caseInfo.codeUrl + ': ' + msg);
			});
		});
	});
}

export function testParseTree(logger) {
	var cases = [
		{'code': '', 'numTopTokens': 0, 'totalTokens': 0, 'height': 0, 'toString': ''},
		{'code': '[]', 'numTopTokens': 1, 'totalTokens': 3, 'height': 2, 'toString': '[ ]'},
		{'code': 'fd 100', 'numTopTokens': 2, 'totalTokens': 2, 'height': 2, 'toString': 'fd 100'},
		{'code': 'fd 100 rt 45', 'numTopTokens': 4, 'totalTokens': 4, 
			'height': 2, 'toString': 'fd 100 rt 45'},
		{'code': 'repeat 1 [fd 1]', 'height': 4, 'numTopTokens': 3, 'totalTokens': 7, 'topTypes': 
			[
				ParseTreeTokenType.PARAMETERIZED_GROUP
			], 
			'toString': 'repeat 1 [ fd 1 ]'
		},
		{'code': 'repeat 1 []', 'height': 3, 'numTopTokens': 3, 'totalTokens': 5, 'topTypes': 
			[
				ParseTreeTokenType.PARAMETERIZED_GROUP
			], 
			'toString': 'repeat 1 [ ]'
		},
		{'code': 'repeat 1 [fd 1 rt 90]', 'height': 4, 'numTopTokens': 3, 'topTypes': 
			[
				ParseTreeTokenType.PARAMETERIZED_GROUP
			], 
			'toString': 'repeat 1 [ fd 1 rt 90 ]'
		},
		{'code': 'fd 10+5', 'numTopTokens': 2, 'height': 3, 'toString': 'fd 10 + 5'},
		{'code': 'fd 10+5*2', 'numTopTokens': 2, 'height': 4, 'toString': 'fd 10 + 5 * 2'},
		{'code': 'fd 10*2+5', 'numTopTokens': 2, 'height': 4, 'toString': 'fd 10 * 2 + 5'},
		{'code': 'make "x 10', 'numTopTokens': 3, 'height': 2, 'toString': 'make "x 10'},
		{'code': 'make "x (list 10)', 'numTopTokens': 3, 'height': 4, 'toString': 'make "x ( list 10 )',
			'topTypes':
			[
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'to donothing\nend',
			'numTopTokens': 1, 'height': 2, 'toString': 'to donothing   end',
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD,
			]
		},
		{
			'code': 'to donothing :x\nend',
			'numTopTokens': 1, 'height': 3, 'toString': 'to donothing :x  end',
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD,
			]
		},
		{
			'code': 'to donothing :x\n;hello world\nend',
			'numTopTokens': 1, 'height': 3, 'toString': 'to donothing :x  end',
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD,
			]
		},
		{
			'code': 'to dosomething :x\nprint 1\nend',
			'numTopTokens': 1, 'height': 4, 'toString': 'to dosomething :x print 1 end',
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD,
			]
		},
		{
			'code': 'print [56+random 200]', 'numTopTokens': 2, 'height': 5
		},
		{
			'code': 'setpc (list 56+random 200 56+random 200 56+random 200)',
			'numTopTokens': 2, 'height': 6
		},
		{
			'code': 'print [Choose YES to run example now, Choose NO Study it now.]',
			'numTopTokens': 2, 'height': 4,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'print [to run example, Choose NO.]',
			'numTopTokens': 2, 'height': 4,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'to proc1\nprint "hi\nend',
			'numTopTokens': 1, 'height': 4,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD
			]
		},
		{
			'code': 'to proc1\nprint "hi\nend\nto proc2\nprint "yo\nend',
			'numTopTokens': 2, 'height': 4,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD,
				ParseTreeTokenType.PROCEDURE_START_KEYWORD
			]
		},
		{
			'code': 'to something\nprint "hi\nend\nprint "hello',
			'numTopTokens': 3,
			'height': 4,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD,
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'make "x 0',
			'numTopTokens': 3,
			'height': 2,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'if :x < 1 [print :x]',
			'numTopTokens': 3,
			'height': 4,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'ifelse :x < 1 [print :x] [print 2]',
			'numTopTokens': 4,
			'height': 4,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'print 5/4', 'numTopTokens': 2,
			'height': 3,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'print 1+2*3', 'numTopTokens': 2,
			'height': 4,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'print (1+2)*3', 'numTopTokens': 2,
			'height': 5,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'print 2*sqrt 100', 'numTopTokens': 2,
			'height': 4,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'to fd\nend',
			'numTopTokens': 1,
			'totalTokens': 5,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD
			]
		},
		{
			'code': 'make "x 100\nfd :x',
			'numTopTokens': 5,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP,
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'to p\nend',
			'numTopTokens': 1,
			'totalTokens': 5,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD
			]
		},
		{
			'code': 'to p\n[]\nend',
			'numTopTokens': 1,
			'totalTokens': 8,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD
			]
		},
		{
			'code': 'to p\n[] []\nend',
			'numTopTokens': 1,
			'totalTokens': 11,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD
			]
		},
		{
			'code': 'to p\n(sum 1 2 3)\nend',
			'numTopTokens': 1,
			'totalTokens': 12,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD
			]
		},
		{
			'code': 'to fS :size\nif :size > 2 [\nfS :size * 0.5]\nend',
			'numTopTokens': 1,
			'totalTokens': 17,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD
			]
		},
		{
			'code': 'setpencolor [255 255 255]',
			'numTopTokens': 2,
			'totalTokens': 7,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP,
				ParseTreeTokenType.LIST
			]
		},
		{
			'code': 'make "x 1 print -:x',
			'numTopTokens': 5,
			'totalTokens': 6
		},
		{
			'code': 'print empty? []',
			'numTopTokens': 2,
			'totalTokens': 5
		},
		{
			'code': 'to p\nif 0 = count [] [\n]\nend',
			'numTopTokens': 1,
			'totalTokens': 15,
			'topTypes': [
				ParseTreeTokenType.PROCEDURE_START_KEYWORD
			]
		},
		{
			'code': 'make "x -(1)',
			'numTopTokens': 3,
			'totalTokens': 7,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		},
		{
			'code': 'make "x -arctan 0.5',
			'numTopTokens': 3,
			'totalTokens': 5,
			'topTypes': [
				ParseTreeTokenType.PARAMETERIZED_GROUP
			]
		}
	];

	cases.forEach(function(caseInfo) {
		const prefixedLogger = prefixWrapper('Failure while processing code ' + caseInfo.code, logger);
		try {
			processTestCase(caseInfo, prefixedLogger);
		}
		catch (e) {
			console.error('Unexpected error thrown: ', e);
			prefixedLogger('JavaScript exception thrown: ' + e);
		}
	});
	testAsyncCases(logger);
}