import { Command } from
'../../../../Command.js';
import { DataTypes } from
'../../../../data-types/DataTypes.js';
import { intersectWithAssertedTypes } from
'./intersectWithAssertedTypes.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
await Command.asyncInit();

export function intersectWithCommandArgTypes(callToken,
variableName, tokenToTypes, result, cachedParseTree) {
	const info = Command.getCommandInfo(callToken.val);
	if (info !== undefined) {
		if (info.primaryName === 'assert') {
			intersectWithAssertedTypes(callToken, variableName, tokenToTypes, result, cachedParseTree);
			return;
		}
		const children = callToken.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if ((child.type !== ParseTreeTokenType.VARIABLE_READ &&
			!child.isStringLiteral()) ||
			child.val.toLowerCase() !== variableName)
				continue;
			let argInfo = info.args[i];
			let types;
			if (argInfo !== undefined && argInfo.refTypes !== undefined &&
			child.isStringLiteral()) {
				types = new DataTypes(argInfo.refTypes);
			}
			else
				types = new DataTypes(Command.getParameterTypes(info, i));
			result.intersectWith(types);
		}
	}
};