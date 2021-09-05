import { Command } from '../Command.js';
import { DataTypes } from '../data-types/DataTypes.js';
import { evaluateToken } from './evaluateToken.js';
import { getOutputTypesForProcedure } from './getOutputTypesForProcedure.js';
import { getPossibleDataTypesForVariableAtToken } from './getPossibleDataTypesForVariableAtToken.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function getPossibleDataTypesEvaluatedFromToken(token, proceduresMap, varNamesNotToCheck) {
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');
	if (!(varNamesNotToCheck instanceof Set))
		throw new Error('varNamesNotToCheck must be a Set');
	const val = evaluateToken(token, proceduresMap);
	if (val !== undefined)
		return DataTypes.getTypesCompatibleWithValue(val, {
			'procedures': proceduresMap
		});
	if (token.type === ParseTreeTokenType.VARIABLE_READ && getPossibleDataTypesForVariableAtToken !== undefined)
		return getPossibleDataTypesForVariableAtToken(token, token.val.toLowerCase(), proceduresMap, varNamesNotToCheck);
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const commandInfo = Command.getCommandInfo(token.val);
		if (commandInfo === undefined) {
			const proc = proceduresMap.get(token.val.toLowerCase());
			if (proc !== undefined) {
				const startToken = proc.getStartToken();
				if (startToken !== undefined) {
					const result = getOutputTypesForProcedure(startToken, proceduresMap, varNamesNotToCheck);
					if (result !== null)
						return result;
				}
			}
		}
		else {
			return Command.getReturnDataTypes(commandInfo);
		}
	}
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR)
		return new DataTypes(DataTypes.parse(Operators.getBinaryReturnTypes(Operators.getOperatorInfo(token.val))));
	if (token.type === ParseTreeTokenType.UNARY_OPERATOR)
		return new DataTypes(DataTypes.parse(Operators.getUnaryReturnTypes(Operators.getOperatorInfo(token.val))));

	// return all types because we can't narrow the types down.
	return new DataTypes(DataTypes.getAllAssignableDataTypes());
};