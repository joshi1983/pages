import { Command } from '../../../../modules/parsing/Command.js';
import { commandsOfInterest, recommendJumpCommands } from '../../../../modules/parsing/parse-tree-analysis/validation/recommendJumpCommands.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { processValidationTestCase } from './processValidationTestCase.js';
await Command.asyncInit();

/*
We're testing that the primaryName exists because if the command names are changed later, the 
problem could go undetected by any other test.
*/
function verifyCommandsOfInterestExist(logger) {
	if (!(commandsOfInterest instanceof Set))
		logger(`Expected commandsOfInterest to be a Set but got ${commandsOfInterest}`);
	if (commandsOfInterest.size < 3)
		logger(`Expected at least 3 commands of interest but got ${commandsOfInterest.size}`);
	for (let primaryName of commandsOfInterest) {
		const info = Command.getCommandInfo(primaryName);
		if (info === undefined)
			logger(`No command found named: ${primaryName}`);
		else if (info.primaryName !== primaryName)
			logger(`The command ${primaryName} does not exactly match ${info.primaryName}`);
	}
}

function testVariousCode(logger) {
	const cases = [
		{'code': 'fd 100', 'warn': false},
		{'code': 'to p\npenDown\nend\npenup p forward 10', 'warn': false},
		{'code': 'penUp\nto p\nforward 10\nend\npenDown\np', 'warn': false},
		{'code': 'if 5 < random 10 [ penup] forward 10', 'warn': false},
		// the penup might not happen so don't warn.

		{'code': 'penUp repeat 2 [forward 10 penDown]', 'warn': false},
		/*
		Don't warn because the forward 10 will draw a line in the second iteration of the repeat-loop.
		*/

		{'code': 'penUp forward 10', 'warn': true},
		{'code': 'penup forward 10', 'warn': true},
		{'code': 'setPenColor "#0123 forward 10', 'warn': true},
		// 0% opacity so that alphacolor should be treated as transparent.

		{'code': 'penUp setPenSize 1 forward 10', 'warn': true},
		{'code': 'penUp setPenColor "red forward 10', 'warn': true},
		{'code': 'setPenColor transparent forward 10', 'warn': true},
		{'code': 'setPenSize 0\nleft 50\npolyStart\nforward :size * 0.07', 'warn': true},
		{'code': 'to p\nsetPenSize 0\nleft 50\npolyStart\nforward :size * 0.07\nend', 'warn': true},
		{'code': 'setPenSize 0 forward 10', 'warn': true},
		{'code': 'setPenSize 0 fd 10', 'warn': true},
		{'code': 'setPenSize 0 backward 10', 'warn': true},
		{'code': 'setPenSize 0 back 10', 'warn': true},
		{'code': 'setPenSize 0 if 2 < random 5 [back 10]', 'warn': true},
		{'code': 'setPenSize 0 ifelse 2 < random 5 [back 10] []', 'warn': true},
		{'code': 'setPenSize 0 ifelse 2 < random 5 [] [back 10]', 'warn': true},
		{'code': 'setPenSize 0 if 2 < random 5 [if 1 < random 5 [back 10]]', 'warn': true},
		{'code': 'forward 10\nto p\nsetPenSize 0\nforward 3\nend', 'warn': true},
		// the forward 3 should become jumpForward 3.
		{'code': 'setPenSize 0\nsetTurtleState :oldState\nforward 3', 'warn': false},
		{'code': 'make "x 1\nto', 'error': false, 'warn': false}
		/*
		This code is not valid but other validation checks should find the problems.
		The intent of this case is to ensure that no JavaScript error happens.
		*/
	];
	cases.forEach(caseInfo => caseInfo.error = false);
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, recommendJumpCommands);
	});
}

export function testRecommendJumpCommands(logger) {
	verifyCommandsOfInterestExist(prefixWrapper('verifyCommandsOfInterestExist', logger));
	testVariousCode(prefixWrapper('testVariousCode', logger));
};