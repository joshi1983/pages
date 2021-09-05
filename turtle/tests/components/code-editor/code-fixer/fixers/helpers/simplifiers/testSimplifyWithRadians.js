import { ArrayUtils } from
'../../../../../../../modules/ArrayUtils.js';
import { Command } from
'../../../../../../../modules/parsing/Command.js';
import { processTestCases } from
'../../processTestCases.js';
import { renameMap1, renameMap2, simplifyWithRadians } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyWithRadians.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

await Command.asyncInit();

function getBothKeyAndValues(map) {
	const result = Array.from(map.keys());
	ArrayUtils.pushAll(result, Array.from(map.values()));
	return result;
}

function testCommandNameConsistency(logger) {
	const names = getBothKeyAndValues(renameMap1);
	ArrayUtils.pushAll(names, getBothKeyAndValues(renameMap2));
	for (const name of names) {
		const info = Command.getCommandInfo(name);
		if (info === undefined)
			logger(`Unable to find command information for ${name}`);
		else if (info.primaryName !== name)
			logger(`Found command information for ${name} but it does not exactly(case-sensitive) match the primaryName ${info.primaryName}`);
	}
}

function testInGeneral(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print radSin 2', 'logged': false},
		{'code': 'print sin 0',
			'to': 'print radSin 0',
		'logged': true},
		{'code': 'print cos 0',
			'to': 'print radCos 0',
			'logged': true},
		{'code': 'print tan 0',
			'to': 'print radTan 0',
		'logged': true},
		{'code': 'print cos 180',
			'to': 'print radCos 3.141592653589793',
		'logged': true},
		{'code': 'print sin 180',
			'to': 'print radSin 3.141592653589793',
		'logged': true},
		{'code': 'print tan 180',
			'to': 'print radTan 3.141592653589793',
		'logged': true},
		{'code': 'print arcTan2 1 1',
			'to': 'print (radArcTan2 1 1)*57.29577951308232',
		'logged': true},
		{'code': 'print arcTan2 1 1 print "hi',
			'to': 'print (radArcTan2 1 1 )*57.29577951308232 print "hi',
		'logged': true}
	];
	processTestCases(cases, simplifyWithRadians, logger);
}

export function testSimplifyWithRadians(logger) {
	wrapAndCall([
		testCommandNameConsistency,
		testInGeneral,
	], logger);
};