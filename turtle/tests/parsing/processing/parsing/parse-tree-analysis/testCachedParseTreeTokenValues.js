import { CachedParseTree } from
'../../../../../modules/parsing/processing/parsing/parse-tree-analysis/CachedParseTree.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { flatten } from
'../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../modules/parsing/processing/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testCachedParseTreeTokenValues(logger) {
	const cases = [
	{'code': 'int x = 4;', 'checks': [
		{
			'token': {
				'val': '4'
			},
			'out': 4
		}
	]},
	{'code': 'println(true)', 'checks': [
		{
			'token': {
				'val': 'true'
			},
			'out': true
		}
	]},
	{'code': 'println(false)', 'checks': [
		{
			'token': {
				'val': 'false'
			},
			'out': false
		}
	]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tree = new CachedParseTree(parseResult.root);
		const tokens = flatten(parseResult.root);
		const tokenValues = tree.getTokenValues();
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Case ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, clogger);
			const value = tokenValues.get(token);
			if (value !== checkInfo.out)
				clogger(`Expected ${checkInfo.out} but got ${value}`);
		});
	});
};