import { Command } from
'../../../../modules/parsing/Command.js';
import { interestingNames, needsInitialPenColor } from
'../../../../modules/parsing/kojo/translation-to-weblogo/needsInitialPenColor.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

await Command.asyncInit();

function testGeneral(logger) {
	const cases = [
		{'in': '', 'out': false},
		{'in': 'setLineCap "butt', 'out': false},
		{'in': 'setLineJoinStyle "round', 'out': false},
		{'in': 'setPenSize 100', 'out': false},
		{'in': 'setPenColor "red', 'out': false},
		{'in': 'setFillColor "red', 'out': false},
		{'in': 'jumpForward 100', 'out': false},
		{'in': 'jumpRight 100', 'out': false},
		{'in': 'jumpLeft 100', 'out': false},
		{'in': 'jumpIn 100', 'out': false},
		{'in': 'jumpOut 100', 'out': false},
		{'in': 'jumpTo [100 200]', 'out': false},
		{'in': 'setPenColor "blue\nforward 100', 'out': false},
			// the setPenColor "blue before drawing anything removes the need for another setPenColor call.

		{'in': 'setPos [100 200]', 'out': true}, // might draw a line
		{'in': 'arcLeft 100 100', 'out': true},
		{'in': 'arcPair 100 100', 'out': true},
		{'in': 'arcRight 100 100', 'out': true},
		{'in': 'arcLines [[100 100]] 100', 'out': true},
		{'in': 'backward 100', 'out': true},
		{'in': 'circle 100', 'out': true},
		{'in': 'drawArcLineShape [0 0 [[100 100]]] 100', 'out': true},
		{'in': 'drawArcLineShapes [[0 0 [[100 100]]]] 100', 'out': true},
		{'in': 'ellipse 100 200', 'out': true},
		{'in': 'forward 100', 'out': true},
		{'in': 'isotoxalStar 100 50 5', 'out': true},
		{'in': 'isoTriangle 100 200', 'out': true},
		{'in': 'rect 100 200', 'out': true},
		{'in': 'regularPolygon 100 5', 'out': true},
		{'in': 'regularStar 100 5', 'out': true},
		{'in': 'roundIsoStar 100 200 5 10 10', 'out': true},
		{'in': 'roundIsoTriangle 100 200 10', 'out': true},
		{'in': 'roundRect 100 200 10', 'out': true},
		{'in': 'roundRegularPolygon 100 5 10', 'out': true},
		{'in': 'roundRegularStar 100 5 10 10', 'out': true},
		{'in': 'square 100', 'out': true},
		{'in': `jumpForward -50
backward 110`, 'out': true},
	];
	testInOutPairs(cases, needsInitialPenColor, logger);
}

function testInterestingNamesMatchCommands(logger) {
	for (const name of interestingNames) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find a command matching the name ${name}`);
	}
}

export function testNeedsInitialPenColor(logger) {
	wrapAndCall([
		testGeneral,
		testInterestingNamesMatchCommands
	], logger);
};