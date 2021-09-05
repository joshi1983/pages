import { Command } from
'../../../../modules/parsing/Command.js';
import { processValidationTestCases } from './processValidationTestCases.js';
import { closedShapeCommandNames, commandsToIgnore,
commandsPossiblyDrawingOpenPathElement, validatePreventPathJoin } from
'../../../../modules/parsing/parse-tree-analysis/validation/validatePreventPathJoin.js';
import { SetUtils } from '../../../../modules/SetUtils.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';
await Command.asyncInit();

function validateCommands(commandNameSet, logger) {
	for (const name of commandNameSet) {
		const info = Command.getCommandInfo(name);
		if (info === undefined) {
			logger(`Unable to find command info for a name of ${name}`);
		}
		else if (info.primaryName !== name)
			logger(`Found Command info for name ${name} but the primaryName is not exactly the same including the same case.  primaryName=${info.primaryName}`);
	}
}

function testAllPathCommandsAreClassified(logger) {
	const allClassifiedNames = new Set(['polyStart']);
	// adding polyStart here because it is referenced in validatePreventPathJoin.

	SetUtils.addAll(allClassifiedNames, closedShapeCommandNames);
	SetUtils.addAll(allClassifiedNames, commandsToIgnore);
	SetUtils.addAll(allClassifiedNames, commandsPossiblyDrawingOpenPathElement);
	for (const info of Command.getAllCommandsInfo()) {
		if (info.searchKeywords !== undefined &&
		info.searchKeywords.indexOf('path') !== -1 &&
		!allClassifiedNames.has(info.primaryName)) {
			logger(`All path-related commands should be included in one of the command name sets of validatePreventPathJoin but could not find a command named ${info.primaryName}`);
		}
	}
}

function validateClosedShapeCommandNames(logger) {
	validateCommands(closedShapeCommandNames, logger);
}

function validateCommandsToIgnore(logger) {
	validateCommands(commandsToIgnore, logger);
	for (const name of commandsToIgnore) {
		if (closedShapeCommandNames.has(name)) {
			logger(`Any commandsToIgnore should not be closing a shape or path but that doesn't apply to command name ${name}`);
		}
	}
}

function validateCommandsPossiblyDrawingOpenPathElement(logger) {
	validateCommands(commandsPossiblyDrawingOpenPathElement, logger);
	for (const name of commandsToIgnore) {
		if (commandsPossiblyDrawingOpenPathElement.has(name)) {
			logger(`Any commandsToIgnore should not be a possibly draw an open shape or path element but that doesn't apply to command name ${name}`);
		}
	}
};

function generalCases(logger) {
	const cases = [
	{'code': '', 'warn': false, 'error': false},
	{'code': 'preventPathJoin', 'error': true},
	{'code': 'polyStart preventPathJoin', 'error': true},
	{'code': 'fd 100 preventPathJoin fd 20',
		'warn': false, 'error': false},
	{'code': '(fd 100) preventPathJoin fd 20',
		'warn': false, 'error': false},
	{'code': 'fd 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': false},
	{'code': 'to myfd :num\nfd :num\nend\nmyfd 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': false},
	{'code': 'to myfd :num\nfd :num\noutput 100\nend\nsin myfd 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': false},
	{'code': 'arcRight 90 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': false},
	{'code': 'arcLeft 90 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': false},
	{'code': 'arcsLeft [[90 1]] 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': false},
	{'code': 'arcsRight [[90 1]] 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': false},
	{'code': 'arcLines [[90 1]] 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': false},
	{'code': 'fd 100 arcRight 90 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': false},
	{'code': 'polyEnd preventPathJoin arcLeft 20 50',
		'warn': false, 'error': true},
	{'code': 'polyStart fd 100 jumpRight 100 polyEnd preventPathJoin arcLeft 20 50',
		'warn': false, 'error': true},
	{'code': 'circle 100 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': true},
	{'code': 'ellipse 100 40 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': true},
	{'code': 'forward 100 circle 40 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': true},
	{'code': 'forward 100 ellipse 100 40 preventPathJoin arcLeft 20 50',
		'warn': false, 'error': true},
	{'code': 'polyStart forward 100 preventPathJoin arcLeft 20 50',
		'warn': true, 'error': false},
	{'code': 'polyStart arcRight 100 100 preventPathJoin arcLeft 20 50',
		'warn': true, 'error': false},
	{'code': 'forward 100 preventPathJoin polyEnd right 90 forward 200',
		'error': false, 'warn': true},
	{'code': 'forward 100 preventPathJoin closePath right 90 forward 200',
		'error': false, 'warn': true},
	];
	processValidationTestCases(cases, logger, validatePreventPathJoin);
}

export function testValidatePreventPathJoin(logger) {
	wrapAndCall([
		generalCases,
		testAllPathCommandsAreClassified,
		validateClosedShapeCommandNames,
		validateCommandsPossiblyDrawingOpenPathElement,
		validateCommandsToIgnore,
	], logger);
};