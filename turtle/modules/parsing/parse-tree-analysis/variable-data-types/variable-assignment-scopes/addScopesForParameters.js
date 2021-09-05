import { DataTypes } from '../../../data-types/DataTypes.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { VariableAssignmentScope } from '../VariableAssignmentScope.js';
await DataTypes.asyncInit();

export function addScopesForParameters(result, cachedParseTree) {
	for (const [name, proc] of cachedParseTree.getProceduresMap()) {
		const nameParent = proc.nameToken.parentNode;
		if (nameParent !== null && nameParent.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
			const instructionListToken = proc.getInstructionListToken();
			const endToken = proc.getEndToken();
			proc.parameters.forEach(function(paramName) {
				const variable = result.getVariableByName(paramName);
				variable.addScope(new VariableAssignmentScope(instructionListToken,
					instructionListToken, endToken,
					new DataTypes(),
					new DataTypes(DataTypes.getAllAssignableDataTypes()),
					proc, true));
			});
		}
	}
};