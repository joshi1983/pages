import { DataTypes } from '../../data-types/DataTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const parseTreeTokenTypesToDataTypes = new Map([
[ParseTreeTokenType.BOOLEAN_LITERAL, 'bool'],
[ParseTreeTokenType.NUMBER_LITERAL, 'num'],
[ParseTreeTokenType.LIST_LITERAL, 'list'],
[ParseTreeTokenType.STRING_LITERAL, 'string'],
[ParseTreeTokenType.TUPLE_LITERAL, 'tuple']
]);
for (const [pType, dType] of parseTreeTokenTypesToDataTypes) {
	parseTreeTokenTypesToDataTypes.set(pType, new DataTypes(dType));
}

export function setTypesFromParseTreeTokenTypes(tokens, result) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const types = parseTreeTokenTypesToDataTypes.get(token.type);
		if (types !== undefined)
			result.set(token, types);
	}
};