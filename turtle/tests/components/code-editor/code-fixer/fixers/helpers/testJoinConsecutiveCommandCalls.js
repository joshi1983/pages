import { Command } from
'../../../../../../modules/parsing/Command.js';
import { joinConsecutiveCommandCalls, namesToFix } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/joinConsecutiveCommandCalls.js';
import { processTestCases } from '../processTestCases.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testNamesToFix(logger) {
	for (const name of namesToFix) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find WebLogo command from the name ${name}`);
		else if (info.primaryName !== name)
			logger(`The primaryName(${info.primaryName}) does not exactly(case-sensitive) match ${name}.`);
	}
}

function testGeneral(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'forward 1', 'logged': false},
		{'code': 'forward :x', 'logged': false},
		{'code': 'jumpForward :x', 'logged': false},
		{'code': 'forward :x\njumpForward :y', 'logged': false}, // not the same command.
			// If we knew that the pensize was 0, penColor was transparent... or anything 
			// else making the line invisible, we could treat them both as jumpForward.
			// We don't know that, though.

		{'code': 'forward 1\nforward 1', 'logged': true,
		'to': 'forward 1\n+ 1'},
		{'code': 'forward 1\nforward 1\nforward 1', 'logged': true,
		'to': 'forward 1\n+ 1\n+ 1'},
		{'code': 'forward :x\nforward :y', 'logged': true,
		'to': 'forward :x\n+ :y'},
		{'code': 'right :x\nright :y', 'logged': true,
		'to': 'right :x\n+ :y'},
		{'code': 'jumpForward :x\njumpForward :y', 'logged': true,
		'to': 'jumpForward :x\n+ :y'},
	];
	processTestCases(cases, joinConsecutiveCommandCalls, logger);
};

export function testJoinConsecutiveCommandCalls(logger) {
	wrapAndCall([
		testGeneral,
		testNamesToFix
	], logger);
};