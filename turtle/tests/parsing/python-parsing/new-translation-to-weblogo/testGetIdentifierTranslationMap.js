import { CachedParseTree } from
'../../../../modules/parsing/python-parsing/parse-tree-analysis/CachedParseTree.js';
import { getIdentifierTranslationMap } from
'../../../../modules/parsing/python-parsing/new-translation-to-weblogo/getIdentifierTranslationMap.js';
import { parse } from
'../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testGetIdentifierTranslationMap(logger) {
	const cases = [
		{
			'code': 'x=8 x//=1',
			'checks': [
				['x', 'x']
			]
		},
		{
			'code': 'x=2',
			'checks': [
				['x', 'x']
			]
		},
		{
			'code': 'x=2\nX=3',
			'checks': [
				['x', 'x'],
				['X', 'X1']
			]
		},
		{
			'code': 'def f(x):',
			'checks': [
				['x', 'x']
			]
		},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const cachedParseTree = new CachedParseTree(parseResult.root);
		const result = getIdentifierTranslationMap(cachedParseTree);
		for (const [from, to] of caseInfo.checks) {
			const actualTo = result.get(from);
			if (actualTo !== result.get(from))
				plogger(`Expected ${from} to translate to ${to} but found ${result.get(from)}`);
		}
	});
};