import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { CachedParseTree } from
'../../../../../../modules/parsing/python-parsing/parse-tree-analysis/CachedParseTree.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { isLikelyOnPackage } from
'../../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/type-processors/function-calls/isLikelyOnPackage.js';
import { parse } from
'../../../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testIsLikelyOnPackage(logger) {
	const cases = [
		{'code': `print sin(2)`, 'checks': [
			{
				'token': {
					'val': 'sin'
				},
				'packageName': 'math',
				'out': false
			},
			{
				'token': {
					'val': 'print'
				},
				'packageName': 'math',
				'out': false
			},
		]},
		{'code': `import math
print sin(3)`, 'checks': [
			{
				'token': {
					'val': 'sin'
				},
				'packageName': 'math',
				'out': false
			},
			{
				'token': {
					'val': 'print'
				},
				'packageName': 'math',
				'out': false
			},
		]},
		{'code': `import math
print math.sin(3)`, 'checks': [
			{
				'token': {
					'val': 'sin'
				},
				'packageName': 'math',
				'out': true
			}
		]},
		{'code': `from math import *
print sin(3)`, 'checks': [
			{
				'token': {
					'val': 'sin'
				},
				'packageName': 'math',
				'out': true
			}
		]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const cachedParseTree = new CachedParseTree(parseResult.root);
		const tokens = cachedParseTree.getAllTokens();
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, clogger);
			if (token !== undefined) {
				const result = isLikelyOnPackage(token, cachedParseTree, checkInfo.packageName);
				assertEquals(checkInfo.out, result, clogger);
			}
		});
	});
};