import { Command } from '../../Command.js';
import { CommandDataTypes } from '../CommandDataTypes.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getProcedureFromAnyTokenInProcedure } from './getProcedureFromAnyTokenInProcedure.js';
import { OperatorDataTypes } from '../OperatorDataTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();

function getTypesFromVariableScope(scope) {
	if (scope.singleValue !== undefined)
		return DataTypes.getTypesCompatibleWithValue(scope.singleValue);
	if (scope.assignedTypes.isEmpty()) {
		if (scope.requiredTypes.isEmpty())
			return undefined;
		return scope.requiredTypes;
	}
	return scope.assignedTypes;
}

export function getTokenTypesAdvanced(token, variables, tokenToTypesMap) {
	if (token.type === ParseTreeTokenType.VARIABLE_READ) {
		const variable = variables.getVariableByName(token.val.toLowerCase());
		if (variable === undefined)
			return undefined;
		else {
			const procedure = getProcedureFromAnyTokenInProcedure(token);
			const scopes = variable.getScopesAt(token, procedure);
			if (scopes.length === 1) {
				return getTypesFromVariableScope(scopes[0]);
			}
			else if (scopes.length > 1) {
				// If every scope has the same data types, we can return that.
				const types = getTypesFromVariableScope(scopes[0]);
				for (let i = 1; i < scopes.length; i++) {
					const types2 = getTypesFromVariableScope(scopes[i]);
					if (!types2.equals(types))
						return; // disagreeing types so can't return.
				}
				return types;
			}
		}
	}
	else {
		const childTypes = [];
		let childTypesComplete = true;
		for (let i = 0; i < token.children.length; i++) {
			const child = token.children[i];
			let childTypes_ = tokenToTypesMap.get(child);
			if (childTypes_ === undefined) {
				childTypesComplete = false;
				break;
			}
			else
				childTypes.push(childTypes_);
		}
		if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			if (childTypesComplete) {
				const info = Command.getCommandInfo(token.val);
				if (info !== undefined) {
					const types = CommandDataTypes.getReturnDataTypesFromInputs(token.val, childTypes.map(t => t.toString()));
					if (types !== undefined)
						return new DataTypes(types);
				}
			}
		}
		else if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
			if (token.children.length === 2 && OperatorDataTypes.isReturnTypesAffectedByBinaryInputTypes(token.val)) {
				if (childTypesComplete)
					return new DataTypes(OperatorDataTypes.getReturnTypesForBinaryInputTypes(token.val,
						childTypes[0].toString(), childTypes[1].toString()));
			}
			else {
				const info = Operators.getOperatorInfo(token.val);
				return new DataTypes(Operators.getBinaryReturnTypes(info));
			}
		}
		else if (token.type === ParseTreeTokenType.UNARY_OPERATOR) {
			if (token.children.length === 1 && OperatorDataTypes.isReturnTypesAffectedByUnaryInputTypes(token.val)) {
				if (childTypesComplete)
					return new DataTypes(OperatorDataTypes.getReturnTypesForUnaryInputTypes(token.val, childTypes[0].toString()));
			}
			else {
				const info = Operators.getOperatorInfo(token.val);
				return new DataTypes(Operators.getUnaryReturnTypes(info));
			}
		}
		else if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
			if (token.children.length === 3)
				return tokenToTypesMap.get(token.children[1]);
		}
	}
};