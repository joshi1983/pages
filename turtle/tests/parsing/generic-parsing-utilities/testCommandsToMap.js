import { commandsToMap, mergeIntoCommandsMap } from
'../../../modules/parsing/generic-parsing-utilities/commandsToMap.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testMergeIntoCommandsMap(logger) {
	const m = new Map();
	mergeIntoCommandsMap(m, [], true);
	if (m.size !== 0)
		logger(`Expected m.size to be 0 but got ${m.size}`);
	mergeIntoCommandsMap(m, [{'primaryName': 'hi', "staticMethodOfClass": "Math"}], true);
	if (m.size !== 1)
		logger(`Expected m.size to be 1 but got ${m.size}`);
	mergeIntoCommandsMap(m, [{'primaryName': 'bye'}], true);
	if (m.size !== 2)
		logger(`Expected m.size to be 2 but got ${m.size}`);
}

function testGeneralCommandsToMap(logger) {
	const m1 = commandsToMap(false, [], []);
	if (m1.size !== 0)
		logger(`Expected m1.size to be 0 but got ${m1.size}`);
	const m2 = commandsToMap(true, [], []);
	if (m2.size !== 0)
		logger(`Expected m2.size to be 0 but got ${m2.size}`);
	const m3 = commandsToMap(false, [{'primaryName': 'hi'}], [{'primaryName': 'HI'}]);
	if (m3.size !== 1)
		logger(`Expected m3.size to be 1 but got ${m3.size}`);
	const hiValue = m3.get('hi');
	if (hiValue.length !== 2)
		logger(`Expected hiValue.length to be 2 but got ${hiValue.length}`);
	const m4 = commandsToMap(true, [{'primaryName': 'hi'}], [{'primaryName': 'HI'}]);
	if (m4.size !== 2)
		logger(`Expected m4.size to be 2 but got ${m4.size}`);
}

export function testCommandsToMap(logger) {
	wrapAndCall([
		testGeneralCommandsToMap,
		testMergeIntoCommandsMap
	], logger);
};