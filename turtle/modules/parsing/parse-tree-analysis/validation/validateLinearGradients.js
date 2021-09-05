import { Command } from '../../Command.js';
import { DeepEquality } from '../../../DeepEquality.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateLinearGradients(cachedParseTree, parseLogger) {
	const calls = cachedParseTree.getCommandCallsByName('createLinearGradient').filter(call => call.children.length >= 2);
	const msg = 'A linear gradient requires 2 distinct points. ';
	const tokenValues = cachedParseTree.getTokenValues();
	calls.forEach(function(callToken) {
		const children = callToken.children;
		if (tokenValues.has(children[0]) && tokenValues.has(children[1])) {
			const val1 = tokenValues.get(children[0]);
			const val2 = tokenValues.get(children[1]);
			if (val1 === val2 || DeepEquality.equals(val1, val2)) {
				parseLogger.error(msg + `This calculates the same points.`, callToken);
				return;
			}
		}
		if (children[0].type !== children[1].type)
			return;
		if (children[0].type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			for (let i = 0; i < 2; i++) {
				const info = Command.getCommandInfo(children[i].val);
				if (info.primaryName !== 'pos')
					return;
			}
			parseLogger.error(msg + 'You are calling the pos command for both points which will return the same point.', callToken);
		}
		else if (children[0].type === ParseTreeTokenType.VARIABLE_READ &&
		children[0].val.toLowerCase() === children[1].val.toLowerCase()) {
			parseLogger.error(msg + `You are reading the same variable ${children[0].val} for both points which will return the same point.`, callToken);
		}
	});
};