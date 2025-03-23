import { analyzeTokenDataTypes } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/analyzeTokenDataTypes.js';
import { DataTypes } from
'../../../../../../modules/parsing/data-types/DataTypes.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { getAllVariables } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAllVariables.js';
import { getCachedParseTreeFromCode } from
'../../../../../helpers/getCachedParseTreeFromCode.js';
import { getRequiredTypesFromStart } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/required-types/getRequiredTypesFromStart.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { evaluateTokensBasic } from
'../../../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';

export function testGetRequiredTypesFromStart(logger) {
	const cases = [
	{
		'code': 'print :x * 2',
		'token': {
			'val': 'print'
		}, 'out': 'num'
	},
	{
		'code': 'print count :x',
		'token': {
			'val': 'print'
		}, 'out': 'list|string'
	},
	{
		'code': 'if :x []',
		'token': {
			'val': 'if'
		}, 'out': 'bool'
	},
	{
		'code': 'if :y []',
		'token': {
			'val': 'if'
		}, 'out': 'alphacolor|bool|easing|gradient|list|num|plist|string|transparent'
		// all types because x isn't restricted at all.
	},
	{
		'code': 'if :y [ print :x * 2]',
		'token': {
			'val': 'if'
		}, 'out': 'num'
	},
	{
		'code': 'if number? :x [] print :x * 2',
		'token': {
			'val': 'if'
		}, 'out': 'num'
	},
	{
		'code': 'assert number? :x',
		'token': {
			'val': 'assert'
		}, 'out': 'num'
	},
	{
		'code': 'assert and number? :x color? :x',
		'token': {
			'val': 'assert'
		}, 'out': 'int'
	},
	{
		'code': 'queue "x 4',
		'token': {
			'val': 'queue'
		}, 'out': 'list'
	},
	{'code': `to p :num :x
	iF list? :num [
		if list? :x [
			output []
		]
	]
	localmake "result "
	localmake "i 0
	while :i < :x [
		localmake "i :i + 1
	]
	output :result
end`,
		'token': {
			'val': 'iF'
		}, 'out': 'alphacolor|list|num|string'
		// eliminating the alphacolor| would be simpler but that's good enough for now.
},
	{'code': `to p :num :x
	iF list? :num [
		if list? :x [
			output []
		]
	]
end`,
		'token': {
			'val': 'iF'
		}, 'out': 'alphacolor|bool|easing|gradient|list|num|plist|string|transparent'
}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const variableName = 'x';
		const tokens = cachedParseTree.getAllTokens();
		const token = findToken(caseInfo.token, tokens, plogger);
		if (token === undefined)
			return;
		const tokenValueMap = evaluateTokensBasic(cachedParseTree);
		const variables = getAllVariables(cachedParseTree);
		const tokenTypesMap = analyzeTokenDataTypes(cachedParseTree, tokenValueMap, variables);
		const leadingTypes = new DataTypes('*');
		const [u, i] = getRequiredTypesFromStart(cachedParseTree, variableName, token, tokenTypesMap, leadingTypes);
		console.log(`u=${u}, i=${i}`);
		const result = new DataTypes(DataTypes.union(u.types, i.types));
		const resultStr = result.toString();
		if (resultStr !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${resultStr}`);
	});
};