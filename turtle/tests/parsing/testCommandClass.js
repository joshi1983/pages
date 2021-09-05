import { Command } from '../../modules/parsing/Command.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';
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

function testGetCommandsWithVariableRefTypes(logger) {
	const result = Command.getCommandsWithVariableRefTypes();
	if (!(result instanceof Array))
		logger(`Expected an Array but got ${result}`);
	else {
		const primaryNames = new Set();
		result.forEach(function(info, index) {
			if (typeof info !== 'object')
				logger(`Expected getCommandsWithVariableRefTypes to return an Array of object but found ${primaryName} at index ${index}`);
			else
				primaryNames.add(info.primaryName);
		});
		const expectedRefTypeCommands = ['setItem', 'setProperty'];
		expectedRefTypeCommands.forEach(function(primaryName) {
			if (!primaryNames.has(primaryName))
				logger(`Expected to find ${primaryName} in the result from getCommandsWithVariableRefTypes() but did not`);
		});
	}
}

function testGetMethodNameFor(logger) {
	const cases = [
		{'primaryName': '.y', 'out': '_y'},
		{'primaryName': 'x.y', 'out': 'x_y'},
		{'primaryName': 'x.y.', 'out': 'x_y_'},
		{'primaryName': 'x.y.z', 'out': 'x_y_z'},
		{'primaryName': 'createPList', 'out': 'createPList'},
	];
	cases.forEach(function(caseInfo) {
		const result = Command.getMethodNameFor(caseInfo);
		if (result !== caseInfo.out)
			logger(`Expected ${caseInfo.out} but got ${result}`);
	});
}

function testGetParameterTypes(logger) {
	const cases = [
		{
			'primaryName': 'abs',
			'index': 0,
			'out': 'num'
		},
		{
			'primaryName': 'sum',
			'index': 5,
			'out': 'num'
		},
		{
			'primaryName': 'and',
			'index': 5,
			'out': 'bool'
		},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, primaryName = ${caseInfo.primaryName}`, logger);
		const info = Command.getCommandInfo(caseInfo.primaryName);
		const types = Command.getParameterTypes(info, caseInfo.index);
		if (types !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${types}`);
	});
}

function testRefTypes(logger) {
	const expected = 'plist';
	const setPropertyInfo = Command.getCommandInfo('setProperty');
	const result = Command.getParameterRefTypes(setPropertyInfo, 0);
	if (expected !== result)
		logger(`Expected ${expected} but got ${result}`);
}

export function testCommandClass(logger) {
	wrapAndCall([
		generalTest,
		testGetCommandInfoByHintName,
		testGetCommandsWithVariableRefTypes,
		testGetMethodNameFor,
		testGetParameterTypes,
		testRefTypes
	], logger);
};