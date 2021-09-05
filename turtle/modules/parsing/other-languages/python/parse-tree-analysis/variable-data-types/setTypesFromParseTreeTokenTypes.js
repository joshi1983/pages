import { DataTypes } from '../../data-types/DataTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { PythonOperators } from '../../PythonOperators.js';

const parseTreeTokenTypesToDataTypes = new Map([
	[ParseTreeTokenType.BOOLEAN_LITERAL, 'bool'],
	[ParseTreeTokenType.COMMA_EXPRESSION, 'list'],
	[ParseTreeTokenType.NUMBER_LITERAL, 'num'],
	[ParseTreeTokenType.LIST_LITERAL, 'list'],
	[ParseTreeTokenType.LONG_STRING_LITERAL, 'string'],
	[ParseTreeTokenType.STRING_LITERAL, 'string'],
	[ParseTreeTokenType.TUPLE_LITERAL, 'tuple']
]);
for (const [pType, dType] of parseTreeTokenTypesToDataTypes) {
	parseTreeTokenTypesToDataTypes.set(pType, new DataTypes(dType));
}

export function setTypesFromParseTreeTokenTypes(tokens, result) {
	for (const token of tokens) {
		if (token.type === ParseTreeTokenType.BINARY_OPERATOR ||
		token.type === ParseTreeTokenType.UNARY_OPERATOR) {
			const info = PythonOperators.getOperatorInfo(token.val);
			if (info !== undefined) {
				let types;
				if (token.type === ParseTreeTokenType.BINARY_OPERATOR)
					types = info.returnTypes;
				else if (token.type === ParseTreeTokenType.UNARY_OPERATOR &&
				info.unary !== undefined) {
					types = info.unary.returnTypes;
				}
				if (types !== undefined && types.indexOf('|') === -1) {
					// Look for | because that means the types aren't as specific as possible.
					result.set(token, new DataTypes(types));
				}
			}
		}
		const types = parseTreeTokenTypesToDataTypes.get(token.type);
		if (types !== undefined)
			result.set(token, types);
	}
};