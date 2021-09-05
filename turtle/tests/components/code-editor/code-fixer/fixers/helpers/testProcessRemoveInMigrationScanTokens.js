import { compareScanTokens } from
'../../../../../helpers/parsing/compareScanTokens.js';
import { LogoScanner } from
'../../../../../../modules/parsing/LogoScanner.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { processRemoveInMigrationScanTokens } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/processRemoveInMigrationScanTokens.js';

export function testProcessRemoveInMigrationScanTokens(logger) {
	const cases = [
		{'code': 'wacht', 'outTokens': []},
		{'code': 'penUp wacht', 'outTokens': ['penUp']},
		{'code': 'wacht 1', 'outTokens': []},
		{'code': 'wacht -1', 'outTokens': []},
		{'code': 'wacht (1)', 'outTokens': []},
		{'code': 'wacht [1]', 'outTokens': []},
		{'code': 'wacht )', 'outTokens': ['wacht', ')']},
		{'code': 'wacht ]', 'outTokens': ['wacht', ']']},
		{'code': 'wacht 1 fd 10', 'outTokens': ['fd', '10']},
		{'code': 'wacht 1 * 3', 'outTokens': []},
		{'code': 'wacht 1 * :x', 'outTokens': []},
		{'code': 'wacht 1 + :x', 'outTokens': []},
		{'code': 'wacht 1+:x', 'outTokens': []},
		{'code': 'wacht :x / 3 fd 10', 'outTokens': ['fd', '10']},
		{'code': 'wacht -:x', 'outTokens': []},
		{'code': 'wacht -:x fd 10', 'outTokens': ['fd', '10']},
		{'code': 'wacht (:x) * 3 fd 10', 'outTokens': ['fd', '10']},
	];
	const mockMigrationInfo = {
		'commands': [
			{
				'primaryName': 'fd',
				'to': 'fd'
			},
			{
				'primaryName': 'wacht',
				'args': [
					{'name': 'interval'}
				],
				'removeInMigration': true
			}
		]
	};
	const commandsMap = new Map();
	mockMigrationInfo.commands.forEach(function(commandInfo) {
		let names = [commandInfo.primaryName];
		names = names.map(name => name.toLowerCase());
		for (const name of names) {
			commandsMap.set(name, commandInfo);
		}
	});
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.code}`, logger);
		const tokens = LogoScanner.scan(caseInfo.code);
		processRemoveInMigrationScanTokens(tokens, mockMigrationInfo, commandsMap);
		if (tokens.length !== caseInfo.outTokens.length)
			plogger(`Expected ${caseInfo.outTokens.length} tokens but found ${tokens.length}`);
		else {
			for (let i = 0; i < tokens.length; i++) {
				const token1 = tokens[i];
				const expectedToken = caseInfo.outTokens[i];
				compareScanTokens(expectedToken, token1, prefixWrapper(`Token ${i}`, plogger));
			}
		}
	});
};