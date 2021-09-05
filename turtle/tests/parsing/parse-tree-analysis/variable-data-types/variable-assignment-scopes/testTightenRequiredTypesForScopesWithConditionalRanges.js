import { DataTypes } from
'../../../../../modules/parsing/data-types/DataTypes.js';
import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { getDataTypesForScopeWithConditionalRanges } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/tightenRequiredTypesForScopesWithConditionalRanges.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

function testGetDataTypesForScopeWithConditionalRanges(logger) {
	const cases = [
	{'code': `to p :x
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
		output "s
	]
	if integer? :x [
		output "num
	]
	output -:x
end`, 'types': 'num|string'
	},
	{'code': `to p :x
	print "here
	if string? :x [
		output "s
	]
	if integer? :x [
		output "num
	]
	output 2 * :x
end`, 'types': 'num|string'
	},
	{'code': `to p :x
	if string? :x [
		output count :x
	]
	if number? :x [
		output :x + 1
	]
	output str :x
end`, 'types': 'num|string'
	},
	{'code': `to p :x
	if string? :x [
		output count :x
	]
	if list? :x [
		output count :x
	]
	if number? :x [
		output :x + 1
	]
	output str :x
end`, 'types': 'alphacolor|list|num|string'
	// The alphacolor would ideally not be in that result
	// but keeping it in is good enough for now.
	},
	{'code': `to p :x
	if or list? :x string? :x [
		output count :x
	]
	if number? :x [
		output :x + 1
	]
	output str :x
end`, 'types': 'alphacolor|list|num|string'
	// The alphacolor would ideally not be in that result
	// but keeping it in is good enough for now.
	},
	{'code': `to p :x
	if string? :x [
		output "hi
	]
	output str :x
end`, 'types': 'alphacolor|bool|easing|gradient|list|num|plist|string|transparent'}
// 'num|string' would be better.
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const variables = tree.getVariables();
		const x = variables.getVariableByName('x');
		if (x === undefined) {
			plogger(`Expected to find a variable named x but could not find it`);
			return;
		}
		if (x.scopes.length === 0) {
			plogger(`Expected at least 1 scope on variable x but found 0`);
			return;
		}
		const scope = x.scopes[0];
		const result = getDataTypesForScopeWithConditionalRanges(tree, scope);
		const resultStr = DataTypes.stringify(result);
		if (resultStr !== caseInfo.types) {
			plogger(`Expected ${caseInfo.types} but found ${resultStr}`);
		}
	});
}

export function testTightenRequiredTypesForScopesWithConditionalRanges(logger) {
	testGetDataTypesForScopeWithConditionalRanges(logger);
};