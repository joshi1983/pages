import { Command } from
'../../../Command.js';
import { DataTypes } from
'../../../data-types/DataTypes.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();

export function intersectRequiredTypesForParameterizedGroupToken(token, varName, requiredTypes) {
	if (typeof varName !== 'string')
		throw new Error(`varName must be a string but found ${varName}`);
	if (!(requiredTypes instanceof DataTypes))
		throw new Error(`requiredTypes must be a DataTypes instance but got ${requiredTypes}`);
	const info = Command.getCommandInfo(token.val);
	if (info !== undefined) {
		const children = token.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (typeof child.val !== 'string')
				continue;
			if (child.val.toLowerCase() !== varName)
				continue;
			if (child.type === ParseTreeTokenType.VARIABLE_READ) {
				const argInfo = Command.getParameterInfo(info, i);
				requiredTypes.intersectWith(new DataTypes(argInfo.types));
			}
			else if (child.isStringLiteral()) {
				const argInfo = Command.getParameterInfo(info, i);
				if (argInfo.refTypes !== undefined)
					requiredTypes.intersectWith(new DataTypes(argInfo.refTypes));
			}
		}
	}
};