import { Command } from '../../Command.js';
import { CommandDataTypes } from '../CommandDataTypes.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getProcedureFromAnyTokenInProcedure } from './getProcedureFromAnyTokenInProcedure.js';
import { getReturnDataTypesFromInputs } from
'../operator-data-types/getReturnDataTypesFromInputs.js';
import { Operators } from '../../Operators.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();
await Operators.asyncInit();

function getTypesFromVariableAssignmentScope(scope, token) {
	const conditionalRange = scope.getConditionalRangeAt(token);
	if (conditionalRange !== undefined)
		return conditionalRange.satisfyingDataTypes;
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
	while (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	token.children.length === 3) {
		token = token.children[1];
	}
	if (token.type === ParseTreeTokenType.VARIABLE_READ) {
		const variable = variables.getVariableByName(token.val.toLowerCase());
		if (variable === undefined)
			return undefined;
		else {
			const procedure = getProcedureFromAnyTokenInProcedure(token);
			const scopes = variable.getScopesAt(token, procedure);
			if (scopes.length === 1) {
				return getTypesFromVariableAssignmentScope(scopes[0], token);
			}
			else if (scopes.length > 1) {
				// If every scope has the same data types, we can return that.
				const types = getTypesFromVariableAssignmentScope(scopes[0], token);
				for (let i = 1; i < scopes.length; i++) {
					const types2 = getTypesFromVariableAssignmentScope(scopes[i], token);
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
			const info = Command.getCommandInfo(token.val);
			if (info !== undefined && info.primaryName === 'repcount') {
				let closestRepeat = token.parentNode;
				while (closestRepeat !== null) {
					if (closestRepeat.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
						const rInfo = Command.getCommandInfo(closestRepeat.val);
						if (rInfo !== undefined &&
						rInfo.primaryName === 'repeat') {
							const firstToken = closestRepeat.children[0];
							if (Number.isInteger(firstToken.val))
								return new DataTypes(`int(max=${firstToken.val},min=1)`);

							const types = tokenToTypesMap.get(firstToken);
							if (types !== undefined && types.types.size === 1) {
								const type = types.types.values().next().value;
								if (type.name === 'int' && type.max >= 1 &&
								Number.isFinite(type.max))
									return new DataTypes(`int(max=${type.max},min=1)`);
							}
							return;
						}
					}
					closestRepeat = closestRepeat.parentNode;
				}
				return;
			}
			if (childTypesComplete) {
				if (info !== undefined) {
					if (info.primaryName === 'invoke') {
						const firstChild = token.children[0];
						if (firstChild.type === ParseTreeTokenType.STRING_LITERAL) {
							const childCommandInfo = Command.getCommandInfo(firstChild.val);
							if (childCommandInfo !== undefined && childCommandInfo.primaryName !== 'invoke') {
								const types = childCommandInfo.returnTypes;
								return new DataTypes(types);
							}
						}
					}
					else {
						const types = CommandDataTypes.getReturnDataTypesFromInputs(token.val, childTypes.map(t => t.toString()));
						if (types !== undefined)
							return new DataTypes(types);
					}
				}
			}
		}
		else if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
			if (token.children.length === 2) {
				if (childTypesComplete)
					return new DataTypes(getReturnDataTypesFromInputs(token.val,
						[childTypes[0].toString(), childTypes[1].toString()]));
			}
			else {
				const info = Operators.getOperatorInfo(token.val);
				return new DataTypes(Operators.getBinaryReturnTypes(info));
			}
		}
		else if (token.type === ParseTreeTokenType.UNARY_OPERATOR) {
			if (token.children.length === 1) {
				if (childTypesComplete)
					return new DataTypes(getReturnDataTypesFromInputs(token.val, [childTypes[0].toString()]));
			}
			else {
				const info = Operators.getOperatorInfo(token.val);
				return new DataTypes(Operators.getUnaryReturnTypes(info));
			}
		}
	}
};