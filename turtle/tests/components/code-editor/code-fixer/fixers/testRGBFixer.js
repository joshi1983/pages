import { Command } from
'../../../../../modules/parsing/Command.js';
import { processTestCases } from './processTestCases.js';
import { parentPrimaryNamesOfInterest, rgbFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/rgbFixer.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';
await Command.asyncInit();

function testGeneral(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'setFillColor rgb(0,1,2)',
			'to': 'setFillColor "#000102',
			'logged': true},
		{'code': 'setPenColor rgb(0,1,2)',
			'to': 'setPenColor "#000102',
			'logged': true},
		{'code': 'setPenColor rgb(0,16,32)',
			'to': 'setPenColor "#001020',
			'logged': true},
		{'code': 'setScreenColor rgb(0, 133, 213)',
			'to': 'setScreenColor "#0085D5  ',
			'logged': true}
	];
	processTestCases(cases, rgbFixer, logger);
}

function testParentPrimaryNamesOfInterest(logger) {
	for (const name of parentPrimaryNamesOfInterest) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to get command information for name ${name}`);
		else if (info.primaryName !== name)
			logger(`primaryName does not exactly(case-sensitive) match. primaryName=${info.primaryName}, name=${name}`);
	}
}

export function testRGBFixer(logger) {
	wrapAndCall([
		testGeneral,
		testParentPrimaryNamesOfInterest
	], logger);
};