import { DataTypes } from
'../../../../data-types/DataTypes.js';
import { mightBeDataValue } from './mightBeDataValue.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from
'../../../QBasicInternalFunctions.js';

const stringTypes = new DataTypes('string');
const nonStringLiteralTypes = new Set([
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL
]);

export function mightBeString(token) {
	if (!mightBeDataValue(token))
		return false;
	if (nonStringLiteralTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.FUNCTION_CALL) {
		const firstChild = token.children[0];
		if (firstChild !== undefined &&
		firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val);
			if (info !== undefined && info.returnTypes !== undefined) {
				return stringTypes.hasIntersectionWith(new DataTypes(info.returnTypes));
			}
		}
	}
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR && token.val !== '+')
		return false;
	return true;
};