import { UnsupportedCommand } from '../../modules/parsing/UnsupportedCommand.js';

function testGettingUnsupportedCommands(logger) {
	const cases = [
		{'name': 'goto', 'isFound': true},
		{'name': 'GOTO', 'isFound': true},
		{'name': 'Goto', 'isFound': true},
		{'name': 'zoom', 'isFound': true},
		{'name': 'cleartext', 'isFound': true},
		{'name': 'fd', 'isFound': false}
	];
	cases.forEach(function(caseInfo) {
		const commandInfo = UnsupportedCommand.getUnsupportedCommandInfo(caseInfo.name);
		if ((commandInfo !== undefined) !== caseInfo.isFound)
			logger('Expected to find ' + caseInfo.name + '? ' + caseInfo.isFound + ' but the commandInfo returned is ' + commandInfo);
	});
}

export function testUnsupportedCommand(logger) {
	testGettingUnsupportedCommands(logger);
};