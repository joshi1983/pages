import { Command } from '../../Command.js';
import { evaluateStringLiteralVal } from '../evaluateStringLiteralVal.js';
import { getCommandGroups } from '../../../command-groups/getCommandGroups.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await Command.asyncInit();

const commandGroups = getCommandGroups(undefined);

export function getTokenValueBasic(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			if (info.returnTypes === null)
				return null;
			else if (token.children.length === 0 && info.args.length === 0 && info.isStaticEvaluationSafe) {
				return commandGroups.get(info.commandGroup)[info.primaryName]();
			}
		}
	}
	else if (token.type === ParseTreeTokenType.LIST) {
		const nonBrackets = token.children.filter(t => !t.isBracket());
		if (nonBrackets.length === 0)
			return [];
		else {
			const result = [];
			for (let i = 0; i < nonBrackets.length; i++) {
				const token = nonBrackets[i];
				if (token.isStringLiteral() || [
					ParseTreeTokenType.NUMBER_LITERAL,
					ParseTreeTokenType.BOOLEAN_LITERAL
				].indexOf(token.type) !== -1)
					result.push(token.val);
				else
					return; // indicate unable to evaluate.
			}
			return result;
		}
	}
	else if (token.type === ParseTreeTokenType.BINARY_OPERATOR && token.val === '*' && token.children.length === 2) {
		// 0 times any value is 0.
		if (token.children[0].type === ParseTreeTokenType.NUMBER_LITERAL && token.children[0].val === 0)
			return 0;
		// any value multiplied by 0 is 0.
		if (token.children[1].type === ParseTreeTokenType.NUMBER_LITERAL && token.children[1].val === 0)
			return 0;
	}
	else if (token.type === ParseTreeTokenType.LONG_STRING_LITERAL ||
	token.type === ParseTreeTokenType.STRING_LITERAL) {
		return evaluateStringLiteralVal(token.val);
	}
	else if ([ParseTreeTokenType.NUMBER_LITERAL,
		ParseTreeTokenType.BOOLEAN_LITERAL].indexOf(token.type) !== -1)
		return token.val;
};