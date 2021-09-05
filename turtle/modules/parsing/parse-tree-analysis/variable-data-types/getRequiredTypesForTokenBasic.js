import { Command } from '../../Command.js';
import { Operators } from '../../Operators.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();
await Operators.asyncInit();

export function getRequiredTypesForTokenBasic(token) {
	const parentToken = token.parentNode;
	const index = parentToken.children.indexOf(token);
	if (parentToken.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(parentToken.val);
		if (info === undefined)
			return;
		if (index >= info.args.length)
			return;
		const argInfo = info.args[index];
		return argInfo.types;
	}
	else if (parentToken.type === ParseTreeTokenType.BINARY_OPERATOR) {
		const info = Operators.getOperatorInfo(parentToken.val);
		return Operators.getParameterTypes(info, index);
	}
	else if (parentToken.type === ParseTreeTokenType.UNARY_OPERATOR) {
		const info = Operators.getOperatorInfo(parentToken.val);
		return info.unary.arg;
	}
};