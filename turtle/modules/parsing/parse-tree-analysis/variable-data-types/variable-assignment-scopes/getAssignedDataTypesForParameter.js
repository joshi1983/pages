import { DataTypes } from '../../../data-types/DataTypes.js';
import { getAssignedTypesForProcedureParameterBasic } from './getAssignedTypesForProcedureParameterBasic.js';
await DataTypes.asyncInit();

export function getAssignedDataTypesForParameter(cachedParseTree, variableScope, tokenTypesMap) {
	const procedure = variableScope.procedure;
	const calls = cachedParseTree.getProcedureCallsByName(procedure.name);
	const parameterIndex = procedure.parameters.indexOf(variableScope.variable.name);
	if (parameterIndex !== -1 && calls.length !== 0) {
		return getAssignedTypesForProcedureParameterBasic(cachedParseTree, procedure, parameterIndex, tokenTypesMap);
	}
	else {
		return new DataTypes(variableScope.requiredTypes);
	}
};