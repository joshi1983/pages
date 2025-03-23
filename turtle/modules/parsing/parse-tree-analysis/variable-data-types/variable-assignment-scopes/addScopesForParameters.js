import { DataTypes } from '../../../data-types/DataTypes.js';
import { getAssignedTypesForProcedureParameterBasic } from
'./getAssignedTypesForProcedureParameterBasic.js';
import { VariableAssignmentScope } from '../VariableAssignmentScope.js';
await DataTypes.asyncInit();

export function addScopesForParameters(result, cachedParseTree, tokenTypesMap) {
	for (const [name, proc] of cachedParseTree.getProceduresMap()) {
		const instructionListToken = proc.getInstructionListToken();
		const endToken = proc.getEndToken();
		proc.parameters.forEach(function(paramName, parameterIndex) {
			const variable = result.getVariableByName(paramName);
			variable.addScope(new VariableAssignmentScope(instructionListToken,
				instructionListToken, endToken,
				getAssignedTypesForProcedureParameterBasic(cachedParseTree, proc, parameterIndex, tokenTypesMap),
				new DataTypes(DataTypes.getAllAssignableDataTypes()),
				proc, true));
		});
	}
};