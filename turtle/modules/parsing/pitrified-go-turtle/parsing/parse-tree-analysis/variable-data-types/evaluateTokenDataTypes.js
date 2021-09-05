import { flatten } from
'../../../../generic-parsing-utilities/flatten.js';
import { isPossibleData } from
'../../isPossibleData.js';
import { MigrationInfo } from
'../../../MigrationInfo.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';

const typeToDataTypes = new Map([
	[ParseTreeTokenType.BOOLEAN_LITERAL, 'bool'],
	[ParseTreeTokenType.STRING_LITERAL, 'string']
]);

function evaluateDataTypesForToken(token, result, settings) {
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
}

export function evaluateTokenDataTypes(root, settings) {
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but found ${settings}`);

	const result = new Map();
	let tokens = new Set(flatten(root).filter(isPossibleData));
	let continueLooping = true;
	while (continueLooping) {
		continueLooping = false;
		for (const token of tokens) {
			const val = evaluateDataTypesForToken(token, result, settings);
			if (val !== undefined) {
				continueLooping = true;
				result.set(token, val);
			}
		}
		tokens = new Set();
		SetUtils.remove(tokens, (t) => !result.has(t));
	}
	return result;
};