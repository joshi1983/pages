import { Command } from '../../parsing/Command.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { ParseTreeToken } from '../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

function mightTokenExecuteDifferently(token1, token2) {
	if (token1.type !== token2.type)
		return true;
	if (token1.children.length !== token2.children.length)
		return true;
	if (token1.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		if (token1.val.toLowerCase() !== token2.val.toLowerCase()) {
			const info1 = Command.getCommandInfo(token1.val);
			const info2 = Command.getCommandInfo(token2.val);
			if (info1 === undefined || info2 === undefined ||
			info1.primaryName !== info2.primaryName)
				return true;
		}
	}
	else if (token1.val !== token2.val)
		return true;
	for (let i = 0; i < token1.children.length; i++) {
		const child1 = token1.children[i];
		const child2 = token2.children[i];
		if (mightTokenExecuteDifferently(child1, child2)) {
			return true;
		}
	}
	return false;
}

export function mightExecuteDifferently(parseTree1, parseTree2) {
	if (!(parseTree1 instanceof ParseTreeToken))
		throw new Error(`parseTree1 must be a ParseTreeToken but got ${parseTree1}`);
	if (!(parseTree2 instanceof ParseTreeToken))
		throw new Error(`parseTree2 must be a ParseTreeToken but got ${parseTree2}`);
	if (mightTokenExecuteDifferently(parseTree1, parseTree2))
		return true;
	return false;
};