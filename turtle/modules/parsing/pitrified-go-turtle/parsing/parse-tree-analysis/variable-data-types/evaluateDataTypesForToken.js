import { MigrationInfo } from
'../../../MigrationInfo.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const typeToDataTypes = new Map([
	[ParseTreeTokenType.BOOLEAN_LITERAL, 'bool'],
	[ParseTreeTokenType.CHARACTER_LITERAL, 'char'],
	[ParseTreeTokenType.STRING_LITERAL, 'string']
]);

export function evaluateDataTypesForToken(token, result, settings) {
	const types = typeToDataTypes.get(token.type);
	if (typeof types === 'string')
		return types;
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL) {
		const val = token.val;
		if (val.endsWith('i'))
			return 'imaginary_number';
		else if (val.indexOf('.') === -1 && val.toLowerCase().indexOf('e') === -1)
			return 'int';
		else
			return 'float';
	}
	if (token.type === ParseTreeTokenType.FUNC_CALL) {
		const info = MigrationInfo.getFunctionInfo(token, settings);
		if (info !== undefined) {
			if (info.returnTypes !== undefined)
				return info.returnTypes;
		}
	}
};