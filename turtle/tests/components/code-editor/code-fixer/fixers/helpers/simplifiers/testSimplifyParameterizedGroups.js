import { Command } from
'../../../../../../../modules/parsing/Command.js';
import { processTestCases } from
'../../processTestCases.js';
import { cloneNotNeededChildNames, countChildNames, simplifyParameterizedGroups } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyParameterizedGroups.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

function matchNamesWithPrimaryNames(names, logger) {
	for (const name of names) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find a command from the name ${name}`);
		else if (info.primaryName !== name)
			logger(`The primaryName must match exactly the same but it is not matched. ${name} is not ${info.primaryName}`);
	}
}

function testCloneNotNeededChildNames(logger) {
	matchNamesWithPrimaryNames(cloneNotNeededChildNames, logger);
}

function testCountChildNames(logger) {
	matchNamesWithPrimaryNames(countChildNames, logger);
}

function testGeneralCases(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print vectorScale :x 2', 'logged': false},
		{'code': 'print power :x 5', 'logged': false},
		{'code': 'print power :x 1',
			'to': 'print  :x ', 'logged': true},
		{'code': 'print power :x 0.5',
			'to': 'print sqrt :x ', 'logged': true},
		{'code': 'print vectorScale :x 1',
			'to': 'print  :x ', 'logged': true},
		{'code': `make "x [1 2]
make "y vectorScale :x 1
setItem 1 "y 10
print :x
print :y`,
			'to': `make "x [1 2]
make "y clone :x 
setItem 1 "y 10
print :x
print :y`, 'logged': true},
		{'code': 'print count vectorScale :x 1',
			'to': 'print count  :x ', 'logged': true},
		{'code': 'print count vectorAdd :x :y',
			'to': 'print count  :x ', 'logged': true},
		{'code': 'print count vectorSubtract :x :y',
			'to': 'print count  :x ', 'logged': true},
		{'code': 'print hypot [:x :y 0]',
			'to': 'print hypot [:x :y ]', 'logged': true},
		{'code': 'print hypot [0 0 0]',
			'to': 'print hypot [  ]', 'logged': true},
		{'code': 'print hypot [0 0 :x 0 :y 0]',
			'to': 'print hypot [  :x  :y ]', 'logged': true},
	];
	processTestCases(cases, simplifyParameterizedGroups, logger);
}

export function testSimplifyParameterizedGroups(logger) {
	wrapAndCall([
		testCloneNotNeededChildNames,
		testCountChildNames,
		testGeneralCases
	], logger);
};