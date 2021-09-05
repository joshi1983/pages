import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { Command } from
'../../../../modules/parsing/Command.js';
import { processValidationTestCases } from './processValidationTestCases.js';
import { namesMaybeHidingPen, positionRelatedCalculatingCommandsArray, positionRelatedCommands, validateConsecutiveCommands } from
'../../../../modules/parsing/parse-tree-analysis/validation/validateConsecutiveCommands.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

await Command.asyncInit();

function testCommandPrimaryNameConsistency(logger) {
	const names = [];
	for (const names_ of [namesMaybeHidingPen, positionRelatedCalculatingCommandsArray, positionRelatedCommands]) {
		ArrayUtils.pushAll(names, names_);
	}
	names.forEach(function(name) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find information for a command ${name}`);
		else if (info.primaryName !== name)
			logger(`Found information from name ${name} but the primaryName does not match.  primaryName was ${info.primaryName}`);
	});
}

function testVariousCases(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'fd 100', 'error': false},
		{'code': 'forward 100', 'error': false},
		{'code': 'fd 100 fd 150', 'error': false, 'warn': true},
		{'code': 'forward 100 forward 150', 'error': false, 'warn': true},
		{'code': 'fd 100 forward 150', 'error': false, 'warn': true},
		{'code': 'forward 100 setpensize 10 forward 150', 'error': false, 'warn': false},
		{'code': 'right 50 left 25', 'error': false, 'warn': true},
		{'code': 'fd 50 back 25', 'error': false, 'warn': false},
		// No warning expected.
		// Even if the new turtle position can be found with a single fd 25, "fd 25" won't have the larger effect of drawing the line of 50 length.

		{'code': 'to p\nprint "hi output 10\nend\n fd p\nfd 10', 'error': false, 'warn': false}, 
		// since calling p has a side effect, don't warn.  
		// It might be harder to combine command calls when side effects are caused by evaluating their inputs.

		{'code': 'make "p pos\njumpForward 1\njumpForward distanceToCircle :p 10', 'error': false, 'warn': false},
		{'code': 'make "p pos\ncirclePair 1 1 1\ncirclePair 1 1 distanceToCircle :p 10', 'error': false, 'warn': false},
		{'code': 'make "p pos\narcLeft 1 1\narcLeft 1 distanceToCircle :p 10', 'error': false, 'warn': false},
		{'code': 'make "p pos\narcRight 1 1\narcRight 1 distanceToCircle :p 10', 'error': false, 'warn': false},
		{'code': 'polyStart setPos [0 0] setPos [100 0] setPos [50 100] polyEnd', 'error': false, 'warn': false},
		// consecutive setPos within a polyStart-polyEnd section is not redundent.
		// Each setPos is adding a new vertex to the polygon.

		{'code': 'polyStart jumpTo [0 0] jumpTo [100 0] jumpTo [50 100] polyEnd', 'error': false, 'warn': false},
		// consecutive jumpTo within a polyStart-polyEnd section is not redundent.
		// The reason is the same as with setPos.

		{'code': 'setPos [100 0] setPos [50 100] ',
			'error': false, 'warn': false},
		{'code': 'fd 100 preventPathJoin preventPathJoin', 'error': false, 'warn': true},
		{'code': `setPos [random 100 random 100]
setPos [random 100 random 100]
home`, 'error': false, 'warn': false},
	];
	processValidationTestCases(cases, logger, validateConsecutiveCommands);
}

export function testValidateConsecutiveCommands(logger) {
	wrapAndCall([
		testCommandPrimaryNameConsistency,
		testVariousCases
	], logger);
};