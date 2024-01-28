import { Command } from '../../parsing/Command.js';
import { CommandCalls } from '../../parsing/parse-tree-analysis/CommandCalls.js';
import { ParseTreeToken } from '../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();
const timeNames = Command.getLowerCaseCommandNameSet('animation.time');
const animationTimeSubstrings = Array.from(timeNames);

export function isUsingAnimationTime(fastExecuter, code) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but got ${code}`);
	if (fastExecuter !== undefined && fastExecuter.program !== undefined) {
		const root = fastExecuter.program.parseTree;
		return CommandCalls.getCommandCalls(root, 'animation.time').length !== 0;
	}
	code = code.toLowerCase();
	return animationTimeSubstrings.some(function(substring) {
		return code.indexOf(substring) !== -1;
	});
};