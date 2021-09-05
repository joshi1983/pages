import { Command } from '../../modules/parsing/Command.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
await Command.asyncInit();

function generalTest(logger) {
	const cases = [
		{'name': 'and', 'defaultCount': 2},
		{'name': 'sum', 'defaultCount': 2},
		{'name': 'fd', 'defaultCount': 1},
		{'name': 'hideturtle', 'defaultCount': 0}
	];
	cases.forEach(function(caseInfo) {
		const commandInfo = Command.getCommandInfo(caseInfo.name);
		if (commandInfo === undefined)
			logger('Command unexpectedly not found: ' + caseInfo.name);
		else {
			const actualArgCount = Command.getArgCount(commandInfo);
			if (actualArgCount.defaultCount !== caseInfo.defaultCount)
				logger('Expected ' + caseInfo.defaultCount + ' arguments for command ' + caseInfo.name + ' but got ' + actualArgCount.defaultCount);
		}
	});
}

function testGetCommandInfoByHintName(logger) {
	const cases = [
		{'hintName': 'downward', 'found': true},
		{'hintName': 'downwardddd', 'found': false}
	];
	cases.forEach(function(caseInfo) {
		const info = Command.getCommandInfoByHintName(caseInfo.hintName);
		if ((info !== undefined) !== caseInfo.found)
			logger('Expected to find info of ' + caseInfo.found + ' but got info ' + info);
	});
}

function testRefTypes(logger) {
	const expected = 'plist';
	const result = Command.getParameterRefTypes('setProperty', 0);
	if (expected !== result)
		logger(`Expected ${expected} but got ${result}`);
}

export function testCommandClass(logger) {
	generalTest(prefixWrapper('generalTest', logger));
	testGetCommandInfoByHintName(prefixWrapper('testGetCommandInfoByHintName', logger));
	testRefTypes(prefixWrapper('testRefTypes', logger));
};