import { Command } from
'../../../../../../../modules/parsing/Command.js';
import { processTestCases } from
'../../processTestCases.js';
import { simplifySignSymmetricParameterizedGroups, symmetricNames } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifySignSymmetricParameterizedGroups.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

function testSymmetricCommandNamesFoundInCommands(logger) {
	for (const name of symmetricNames) {
		const info = Command.getCommandInfo(name);
		if (info === undefined) {
			logger(`Unable to find command from name ${name}`);
		}
	}
}

function testGeneral(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print abs 2', 'logged': false},
		{'code': 'print abs -2', 'logged': false},
		{'code': 'print abs :x', 'logged': false},
		{'code': 'print abs -:x', 'to': 'print abs :x', 'logged': true},
		{'code': 'print cos -:x', 'to': 'print cos :x', 'logged': true},
		{'code': 'print radCos -:x', 'to': 'print radCos :x', 'logged': true},
	];
	processTestCases(cases, simplifySignSymmetricParameterizedGroups, logger);
}

export function testSimplifySignSymmetricParameterizedGroups(logger) {
	wrapAndCall([
		testGeneral,
		testSymmetricCommandNamesFoundInCommands
	], logger);
};