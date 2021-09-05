import { Command } from '../../Command.js';
import { CommandDataTypes } from '../CommandDataTypes.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { getOutputTypesForProcedureBasic } from './getOutputTypesForProcedureBasic.js';
import { OperatorDataTypes } from '../OperatorDataTypes.js';
import { Operators } from '../../Operators.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();
await Operators.asyncInit();

export function getTokenTypesBasic(token, isStrict, extraInfo) {
	if (isStrict === undefined)
		isStrict = true;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (isStrict && token.children.length === 2 && OperatorDataTypes.isReturnTypesAffectedByBinaryInputTypes(token.val))
			return undefined; // reserve the calculation for the advanced steps since it might find a more precise result.
		else {
			const info = Operators.getOperatorInfo(token.val);
			return new DataTypes(Operators.getBinaryReturnTypes(info));
		}
	}
	else if (token.type === ParseTreeTokenType.UNARY_OPERATOR) {
		if (isStrict && token.children.length === 1 && OperatorDataTypes.isReturnTypesAffectedByUnaryInputTypes(token.val))
			return undefined; // advanced step might find a more precise result.
			// return undefined to let the advanced step calculate types for token.
		else {
			const info = Operators.getOperatorInfo(token.val);
			return new DataTypes(Operators.getUnaryReturnTypes(info));
		}
	}
	else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		if (isStrict && CommandDataTypes.isReturnTypesAffectedByInputTypes(token.val))
			return undefined; // let advanced step potentially find more specific data types.
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			return new DataTypes(info.returnTypes);
		}
	}
	else if (token.type === ParseTreeTokenType.LIST) {
		return new DataTypes('list');
	}
	else if ([ParseTreeTokenType.NUMBER_LITERAL, ParseTreeTokenType.STRING_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL, ParseTreeTokenType.LONG_STRING_LITERAL].indexOf(token.type) !== -1)
		return DataTypes.getTypesCompatibleWithValue(token.val, extraInfo);
};