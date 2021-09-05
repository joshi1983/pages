import { createRootToken } from '../../../helpers/createRootToken.js';
import { DataTypes } from '../../../../modules/parsing/data-types/DataTypes.js';
import { findGlobalAssignmentScopesInProcedureAt } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/findGlobalAssignmentScopesInProcedureAt.js';
import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';
import { Variable } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/Variable.js';
import { VariableAssignmentScope } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/VariableAssignmentScope.js';
await DataTypes.asyncInit();

function testGetScopesAt(logger) {
	const cases = [
	{
		'code': `to p1
	make "x 0
end

to p2
	make "x 0
	make "x :x + 3
end`,
		'token': {
			'val': 'x',
			'type': ParseTreeTokenType.VARIABLE_READ
		},
		'varName': 'x',
		'hasAGlobalScope': true,
		'findGlobalAssignmentScopesInProcedureCount': 1,
		'numScopes': 1
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const allTokens = tree.getAllTokens();
		const token = findToken(caseInfo.token, allTokens, plogger);
		if (token === undefined)
			return;
		const variables = tree.getVariables();
		const variable = variables.getVariableByName(caseInfo.varName);
		if (variable === undefined) {
			plogger(`Unable to find variable named ${caseInfo.varName}`);
			return;
		}
		if (caseInfo.hasAGlobalScope !== undefined) {
			const result = variable.hasAGlobalScope();
			if (caseInfo.hasAGlobalScope !== result)
				plogger(`Expected hasAGlobalScope to return ${caseInfo.hasAGlobalScope} but got ${result}`);
		}
		const proc = tree.getProcedureAtToken(token);
		if (caseInfo.findGlobalAssignmentScopesInProcedureCount !== undefined) {
			const result = findGlobalAssignmentScopesInProcedureAt(variable.scopes, token, proc);
			if (caseInfo.findGlobalAssignmentScopesInProcedureCount !== result.length)
				plogger(`Expected findGlobalAssignmentScopesInProcedureAt to return ${caseInfo.findGlobalAssignmentScopesInProcedureCount} scopes but got ${result.length}`);
			
		}
		const scopes = variable.getScopesAt(token, proc);
		if (scopes.length !== caseInfo.numScopes)
			plogger(`Expected number of scopes to be ${caseInfo.numScopes} but got ${scopes.length}`);
	});
}

function testHasAGlobalScope(logger) {
	const variable = new Variable('x');
	if (variable.hasAGlobalScope() !== false)
		logger(`Expected false but got ${variable.hasAGlobalScope()}`);
	const assignToken = createRootToken();
	const fromToken = assignToken;
	const toToken = assignToken;
	const assignedTypes = new DataTypes('num');
	const requiredTypes = new DataTypes('*');
	const procedure = undefined;
	const isParameter = false;
	const singleValue = 4;
	variable.addScope(new VariableAssignmentScope(assignToken, fromToken, toToken, assignedTypes, requiredTypes, procedure, isParameter, singleValue));
	if (variable.hasAGlobalScope() !== true)
		logger(`Expected true but got ${variable.hasAGlobalScope()}`);
}

export function testVariable(logger) {
	wrapAndCall([
		testGetScopesAt,
		testHasAGlobalScope
	], logger);
};