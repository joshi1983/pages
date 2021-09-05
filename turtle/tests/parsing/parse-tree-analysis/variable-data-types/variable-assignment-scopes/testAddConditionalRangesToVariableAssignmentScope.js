import { addConditionalRangesToVariableAssignmentScope } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/addConditionalRangesToVariableAssignmentScope.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export function testAddConditionalRangesToVariableAssignmentScope(logger) {
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function.  Not: ${logger}`);
	const cases = [{
		'code': 'make "x 4',
		'numConditionalRanges': 0
	},{
		'code': 'to p :x\nprint :x\nend\np 4',
		'numConditionalRanges': 0
	},{
		'code': 'to p :x\nif number? :x [print :x]\nend\np "yes',
		'numConditionalRanges': 1
	},{
		'code': 'to p :x\nifelse number? :x [print :x] []\nend\np "yes',
		'numConditionalRanges': 1
	},{
		'code': 'to p :x\nif string? :x [print :x]\nend\np 4',
		'numConditionalRanges': 1
	},{
		'code': 'to p :x\nif string? :X [print :x]\nend\np 4',
		'numConditionalRanges': 1
	},{
		'code': 'to p :x\nif (string? :x) [print :x]\nend\np 4',
		'numConditionalRanges': 1
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const scopes = tree.getVariables().getAllScopesAsArray();
		if (scopes.length !== 1)
			plogger(`Expected 1 scope but got ${scopes.length}`);
		else {
			const scope = scopes[0];
			scope.conditionalRanges = [];
			addConditionalRangesToVariableAssignmentScope(scope, tree);
			if (scope.conditionalRanges.length !== caseInfo.numConditionalRanges)
				plogger(`Expected ${caseInfo.numConditionalRanges} but got ${scope.conditionalRanges.length}`);
			else {
				// FIXME: compare deeper with expectations.
			}
		}
	});
};