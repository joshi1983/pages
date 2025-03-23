import { escapeHTML } from '../../../helpers/escapeHTML.js';
import { getAnalyzedVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getTokensByType } from '../../../../modules/parsing/generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testProcessRequiredTypeParameters(logger) {
	const cases = [/*
		{
			'code': 'to p :x\nprint mix :x transparent 0.5\nprint "here\nend',
			'types': 'alphacolor'
		},
		{
			'code': 'to p :x\nfor ["i 1 :x] []\nprint "here\nend',
			'types': 'num' // int should be fine too.
		},
		{
			'code': 'to p :x\nfor ["i :x 10] []\nprint "here\nend',
			'types': 'num' // int is too specific.
		},
		{
			'code': 'to p :x\nprint item 4 :x\nprint "here\nend',
			'types': 'list(minlen=4)|string(minlen=4)'
		},
		{
			'code': 'make "x []\nsetFillColor mix :x transparent 0.5\nprint "here\nend',
			'types': 'alphacolor'
		},
		{
			'code': 'make "x []\nsetFillColor mix :x [] 0.5\nprint "here\nend',
			'types': 'alphacolor|list<alphacolor|list|num>'
			//Ideally, types would be 'list' since [] is not a valid colorlist or alphacolorlist.
			//We're not there quite yet, though.
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
		},
		{'code': `to p :x
	print "here
	if string? :x [
		output "hi
	]
	output str :x
end`, 'types': 'alphacolor|bool|easing|gradient|list|num|plist|string|transparent'},
// 'num|string' would be better.
// Having less than num|string would be very problematic, though.
		{'code': `to p :x
	print "here
	if string? :x [
		output "hi
	]
	if integer? :x [
		if :x < 0 [
			localmake "x -:x
		]
		output word '' ''
	]
	output str :x
end`, 'types': 'num|string'},*/
	{'code': `to p :num :x
		if list? :num [
			if list? :x [
				output []
			]
		]
		localmake "result "
		localmake "i 0
		print "here
		while :i < :x [
			localmake "i :i + 1
		]
		output :result
	end`, 'types': 'alphacolor|bool|easing|gradient|list|num|plist|string|transparent'
	// num|list would be even better.
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