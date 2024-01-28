import { Command } from '../../Command.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function getLengthFromTokenAdvanced(token, tokenValues) {
	const tokenVal = tokenValues.get(token);
	if (tokenVal instanceof Array || typeof tokenVal === 'string')
		return tokenVal.length;
	else if (token.type === ParseTreeTokenType.LIST) {
		let result = token.children.length;
		if (result === 0)
			return 0;
		// Decrement result by the number of square brackets found on either side.
		const firstChild = token.children[0];
		if (firstChild.type === ParseTreeTokenType.LEAF && firstChild.val === '[')
			result--;
		const lastChild = token.children[token.children.length - 1];
		if (lastChild.type === ParseTreeTokenType.LEAF && lastChild.val === ']')
			result--;
		return result;
	}
	else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined && info.returnLengthInfo !== undefined) {
			const lengthInfo = info.returnLengthInfo;
			if (lengthInfo.max === lengthInfo.min)
				return lengthInfo.max;
		}
	}
};