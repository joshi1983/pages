import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { getAnalyzedVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getTokensByType } from '../../../../modules/parsing/generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testProcessRequiredTypeParameters(logger) {
	const cases = [
		{
			'code': 'to p :x\nprint mix :x transparent 0.5\nprint "here\nend',
			'types': 'alphacolor'
		},
		{
			'code': 'make "x []\nsetFillColor mix :x transparent 0.5\nprint "here\nend',
			'types': 'alphacolor'
		},
		{
			'code': 'make "x []\nsetFillColor mix :x [] 0.5\nprint "here\nend',
			'types': 'alphacolor|list<alphacolor|list|num>'
			/*
			Ideally, types would be 'list' since [] is not a valid colorlist or alphacolorlist.
			We're not there quite yet, though.
			*/
		},
		{
			'code': 'to p :x\nassert number? :x\nprint "here\nend',
			'types': 'num'
		},
		{
			'code': 'to p :x\nassert boolean? :x\nprint "here\nend',
			'types': 'bool'
		},
		{
			'code': `to p :x
	print "here
	if string? :x [
		output "s
	]
	if integer? :x [
		output "num
	]
	output str :x
end`, 'types': 'num|string'
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code = ${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const tokens = getTokensByType(tree, ParseTreeTokenType.STRING_LITERAL).filter(t =>
			t.val === 'here');
		if (tokens.length !== 1) {
			plogger(`Expected exactly 1 string literal token with val "here" but found ${tokens.length}`);
			return;
		}
		const token = tokens[0];
		const variables = getAnalyzedVariables(tree);
		const variable = variables.getVariableByName('x');
		const types = variable.getRequiredTypesAtToken(token).toString();
		if (types !== caseInfo.types)
			plogger(escapeHTML(`Expected "${caseInfo.types}" but got "${types}"`));
	});
};