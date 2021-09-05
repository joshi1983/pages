import { findToken } from
'../../../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { mightScopeInclude } from
'../../../../../../../../modules/parsing/js-parsing/parsing/parse-tree-analysis/validation/validating-modules/undefined-identifiers/mightScopeInclude.js';
import { parse } from
'../../../../../../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../../../helpers/prefixWrapper.js';

export function testMightScopeInclude(logger) {
	const cases = [
	{
		'code': `class A {
	a() {
		const lines = 3;
		return lines.map(l => l).join('\n');
		}}`,
		'definingToken': {
			'val': 'lines',
			'hasParentVal': '='
		},
		'identifier': {'val': 'lines',
			'hasParentVal': null},
		'out': true
	},
	{
		'code': `class A {
	constructor() {
		const lines = 3;
		return lines.map(l => l).join('\n');
		}}`,
		'definingToken': {
			'val': 'lines',
			'hasParentVal': '='
		},
		'identifier': {'val': 'lines',
			'hasParentVal': null},
		'out': true
	},
	{
		'code': "(x => x === '' ? '' : ' ' + x)('hi')",
		'definingToken': {
			'val': 'x',
			'hasParentVal': '=>'
		},
		'identifier': {
			'val': 'x',
			'hasParentVal': '+'
		},
		'out': true
	},
	{
		'code': "(x => x === '' ? '' : ' ' + x)('hi')",
		'definingToken': {
			'val': 'x',
			'hasParentVal': '=>'
		},
		'identifier': {
			'val': 'x',
			'hasParentVal': '==='
		},
		'out': true
	},
	{
		'code': 'lines.map(l => 2 * l)',
		'definingToken': {
			'val': 'l',
			'hasParentVal': '=>'
		},
		'identifier': {'val': 'l',
			'hasParentVal': '*'
		},
		'out': true
	},
	{
		'code': 'const x = 3;\nconsole.log(x);',
		'definingToken': {
			'val': 'x',
			'hasParentType': ParseTreeTokenType.ASSIGNMENT,
			'hasParentVal': '='
		},
		'identifier': {'val': 'x', 'hasParentType': ParseTreeTokenType.ARG_LIST},
		'out': true
	},
	{
		'code': 'function f1() {console.log(x);}\nfunction f2(x) {}',
		'definingToken': {
			'val': 'x',
			'hasParentType': ParseTreeTokenType.ARG_LIST,
			'hasGrandParentVal': 'function'
		},
		'identifier': {'val': 'x', 'hasGrandParentVal': null},
		'out': false
	},
	{
		'code': 'function f() { x = 4;} function f2(x) {}',
		'definingToken': {
			'val': 'x',
			'hasParentType': ParseTreeTokenType.ARG_LIST,
			'hasGrandParentVal': 'function'
		},
		'identifier': {
			'val': 'x',
			'hasParentType': ParseTreeTokenType.ASSIGNMENT,
			'hasParentVal': '='
		},
		'out': false
	}
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const identifier = findToken(caseInfo.identifier, tokens, plogger);
		if (identifier === undefined) {
			plogger('Failed to find identifier token');
			return;
		}
		const definingToken = findToken(caseInfo.definingToken, tokens, plogger);
		if (definingToken === undefined) {
			plogger('Failed to find defining token');
			return;
		}
		const result = mightScopeInclude(identifier)(definingToken);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but found ${result}`);
	});
};