import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { filterVariableScopesDeclaredAt } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/filterVariableScopesDeclaredAt.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testFilterVariableScopesDeclaredAt(logger) {
	const cases = [
	{
		'code': 'make "x createPList\nprint :x',
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.VARIABLE_READ
		},
		'varName': 'x',
		'numScopes': 1
	},
	{
		'code': 'make "x createPList\nsetProperty "x "y 5\nprint :x',
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.VARIABLE_READ
		},
		'varName': 'x',
		'numScopes': 1
	},
	{
		'code': 'make "x createPList\nsetProperty "x "y 5',
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.STRING_LITERAL,
			'hasParentVal': 'setProperty'
		},
		'varName': 'x',
		'numScopes': 1
	},
	{
		'code': 'to p\nmake "x createPList\nsetProperty "x "y 5\nend',
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.STRING_LITERAL,
			'hasParentVal': 'setProperty'
		},
		'varName': 'x',
		'numScopes': 1
	},
	{
		'code': 'to p\nlocalmake "x createPList\nsetProperty "x "y 5\nend',
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.STRING_LITERAL,
			'hasParentVal': 'setProperty'
		},
		'varName': 'x',
		'numScopes': 1
	},
	{
		'code': 'print "hi\nmake "x createPList\nsetProperty "x "y 5',
		'token': {
			'val': 'hi',
			'type': ParseTreeTokenType.STRING_LITERAL
		},
		'varName': 'x',
		'numScopes': 0 // should not be found before x is assigned a value.
	},
	{
		'code': 'repeat 2 [\nmake "x createPList\nsetProperty "x "y 5\n]',
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.STRING_LITERAL,
			'hasParentVal': 'setProperty'
		},
		'varName': 'x',
		'numScopes': 1
	},
	{
		'code': 'repeat 2 [\nmake "x createPList\nsetProperty "x "y 5\nprint :x\n]',
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.STRING_LITERAL,
			'hasParentVal': 'setProperty'
		},
		'varName': 'x',
		'numScopes': 1
	},
	{
		'code': 'repeat 2 [\nmake "x createPList\nsetProperty "x "y 5\nprint :x\n]',
		// same code as previous case but different token is being tested.
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.VARIABLE_READ
		},
		'varName': 'x',
		'numScopes': 1
	},
	{
		'code': 'repeat 2 [\nif randomRatio < 0.5 [\nmake "x createPList\nsetProperty "x "y 5\n]\n]',
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.STRING_LITERAL,
			'hasParentVal': 'setProperty'
		},
		'varName': 'x',
		'numScopes': 1
	},
	{
		'code': 'repeat 2 [\nif repcount = 2 [\nsetProperty "x "y 5\n]\nmake "x createPList\n]',
		/*
		This is a weird way to write code but it is obvious that the setProperty would execute after x is assigned a value in this loop.
		*/
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.STRING_LITERAL,
			'hasParentVal': 'setProperty'
		},
		'varName': 'x',
		'numScopes': 2 /* anything more than 0 is good */
	},
	{
		'code': 'repeat 2 [\nsetProperty "x "y 5\nmake "x createPList\n]',
		/*
		There is a problem here because the setProperty definitely happens before x is declared.
		*/
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.STRING_LITERAL,
			'hasParentVal': 'setProperty'
		},
		'varName': 'x',
		'numScopes': 0
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const tokens = tree.getAllTokens();
		const token = findToken(caseInfo.token, tokens, plogger);
		const variables = tree.getVariables();
		if (token !== undefined) {
			const variable = variables.getVariableByName(caseInfo.varName);
			if (variable === undefined)
				plogger(`Expected to find a variable named ${caseInfo.varName} but did not`);
			else {
				const scopes = variable.scopes;
				const result = filterVariableScopesDeclaredAt(tree, scopes, token);
				if (result.length !== caseInfo.numScopes)
					plogger(`Expected the number of filtered scopes to be ${caseInfo.numScopes} but got ${result.length}`);
			}
		}
	});
};