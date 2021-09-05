import { ArrayUtils } from
'../../../../../../../modules/ArrayUtils.js';
import { Command } from
'../../../../../../../modules/parsing/Command.js';
import { processTestCases } from
'../../processTestCases.js';
import { acceptableCommandNames, movableBeforePolyStart,
pathBreakingCommands, positionReadCommands, skippableCommands, simplifyWithPolygon } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyWithPolygon.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

function testPrimaryNames(logger) {
	const names = [];
	ArrayUtils.pushAll(names, acceptableCommandNames);
	ArrayUtils.pushAll(names, movableBeforePolyStart);
	ArrayUtils.pushAll(names, pathBreakingCommands);
	ArrayUtils.pushAll(names, positionReadCommands);
	ArrayUtils.pushAll(names, skippableCommands);
	for (const name of names) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find command information for name ${name}`);
		else if (info.primaryName !== name)
			logger(`Command information found for "${name}" but the primaryName is different.  It is "${info.primaryName}"`);
	}
}

function testWithSpecificOutputs(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'polygon []', 'logged': false},
		{'code': 'polyStart', 'logged': false},
		{'code': 'polyStart penUp', 'logged': false},
		{'code': 'polyStart penDown', 'logged': false},
		{'code': 'polyStart jumpTo [0 0]', 'logged': false},
		{'code': 'jumpTo [0 0]\npolyStart jumpTo [0 10]', 'logged': false},
		{'code': 'polyStart polyEnd', 'logged': false},
		{'code': 'jumpTo [0 0] polyStart polyEnd', 'logged': false},
		{'code': 'jumpTo [0 0] polyStart jumpTo [] polyEnd', 'logged': false},
		{'code': 'polyStart setPos [-100 0] setPos [0 40] setPos [0 0] circle 30 polyEnd',
		'logged': false},
		{'code': 'jumpTo [-100 0] polyStart penDown setPos [0 40] setPos [0 0]  penUp polyEnd', 'logged': false},
			// Translating to the following could change the lines that are drawn:
			// penDown penUp polygon [[-100 0] [0 40] [0 0]]
			// We don't want to change behaviour of the code so this case should not change anything.
		
		{'code': 'jumpTo [-110 0] polyStart setPos [-100 0] setPos [0 40] setPos [0 0] circle 30 polyEnd',
		'logged': false},
			// the circle command call complicates the translation to polygon too much.
			// the circle command reads the turtle's current position.
			// The translation to call the polygon command would reduce mutations of the turtle's position.

		{'code': 'jumpTo [-100 0] polyStart jumpTo [xCor 0]  polyEnd', 'logged': false},
		{'code': 'jumpTo [-100 0] polyStart jumpTo [xCor 0] jumpTo [100 50]  polyEnd', 'logged': false},
			// xCor reads where the turtle is which would be affected by the previous jumpTo call.
			// We don't want to convert this to polygon because something like this will likely evaluate a different
			// number from xCor:
			// polygon [[-100 0] [xCor 0] [100 50]]
		{'code': 'jumpTo [-100 0] print pos polyStart setPos [0 40] setPos [0 0]  polyEnd',
		'logged': false},
			// don't convert anything because the print pos reads the turtle position.
			// Converting to an equivalent polygon call would be complicated by the need to read the same turtle position.

		{'code': 'jumpTo [-100 0] polyStart jumpTo [0 40] jumpTo [0 0]  polyEnd',
		'to': '   polygon [[-100 0] [0 40]  [0 0]  ]', 'logged': true},
			// If the polyEnd is a direct child of the parse tree root,
			// return true.
			// Converting the corresponding polyStart... polyEnd to a polygon will change
			// where the turtle position is.
			// That would affect subsequent calls from Commander inputs
			// or rerunning the program without resetting everything.
			// That difference is acceptable, though.

		{'code': 'jumpTo [-100 0] polyStart setPos [0 40] setPos [0 0]  polyEnd',
		'to': '   polygon [[-100 0] [0 40]  [0 0]  ]', 'logged': true},
		{'code': 'jumpTo [-100 0] polyStart penUp setPos [0 40] setPos [0 0]  polyEnd',
		'to': '   penUp polygon [[-100 0]  [0 40]  [0 0]  ]', 'logged': true},
		{'code': 'jumpTo [-100 0] polyStart penUp setPos [0 40] setPos [0 0]  penDown polyEnd',
		'to': '   penUp penDown polygon [[-100 0]  [0 40]  [0 0]   ]', 'logged': true},
		{'code': `jumpTo [160 -315]
polyStart
setPos [ 158 -316 ]
setPos [ 159 -317 ]
polyEnd`, 'to': `  
polygon[[160 -315]
 [ 158 -316 ]
 [ 159 -317 ]
]`, 'logged': true}
	];
	processTestCases(cases, simplifyWithPolygon, logger);
}

export function testSimplifyWithPolygon(logger) {
	wrapAndCall([
		testPrimaryNames,
		testWithSpecificOutputs
	], logger);
};