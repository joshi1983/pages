import { Command } from '../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();

/*
Returns reference data types or undefined.
An undefined result represents unknown or inapplicable.
*/
export function getRefTypes(token) {
	if (!token.isStringLiteral() || token.parentNode === null || token.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return;
	const info = Command.getCommandInfo(token.parentNode.val);
	if (info === undefined)
		return;
	const index = token.parentNode.children.indexOf(token);
	if (info.args.length <= index)
		return;
	return new DataTypes(info.args[index].refTypes);
};