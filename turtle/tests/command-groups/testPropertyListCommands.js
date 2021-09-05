import { PropertyListCommands } from '../../modules/command-groups/PropertyListCommands.js';

function testBasics(logger) {
	const plistCommands = new PropertyListCommands();
	const empty = plistCommands.plistCreate();
	if (!(empty instanceof Map))
		logger('plistCreate expected to return an instance of Map but did not get one.  Instead got: ' + empty);
	const plistResult = plistCommands.plist(empty);
	if (plistResult.length !== 0)
		logger('plist command should return an empty Array but got a length of ' + plistResult.length);
	const nonEmpty = new Map();
	nonEmpty.set("x", 5);
	const plistResult2 = plistCommands.plist(nonEmpty);
	if (plistResult2.length !== 2)
		logger('plist command expected to return 2 elements in an Array but instead got a length of ' + plistResult2.length);
}

export function testPropertyListCommands(logger) {
	testBasics(logger);
};