import { addVariableAssignmentScopes } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/addVariableAssignmentScopes.js';
import { escapeHTML } from
'../../../../helpers/escapeHTML.js';
import { getAllVariables } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAllVariables.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';

export function testAddVariableAssignmentScopes(logger) {
	const code = `make "x [2]`;
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const variables = getAllVariables(cachedParseTree);
	if (variables.getVariableByName('x') === undefined)
		logger('Expected to find x but it was not found');
	else {
		addVariableAssignmentScopes(cachedParseTree, variables);
		const xVar = variables.getVariableByName('x');
		const scopes = xVar.scopes;
		if (scopes.length !== 1)
			logger(`Expected to find 1 scope but found ${scopes.length}`);
		else {
			const scope = scopes[0];
			const types = scope.assignedTypes;
			if (types.toString() !== 'list<int>(minlen=1)')
				logger(escapeHTML(`Expected list<int>(minlen=1) but got ${types.toString()}`));
		}
	}
};