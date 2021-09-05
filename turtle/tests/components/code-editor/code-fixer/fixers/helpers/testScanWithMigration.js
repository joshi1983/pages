import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { compareScanTokens } from
'../../../../../helpers/parsing/compareScanTokens.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { removeSingleLineCommentsWithSymbol, scanWithMigration } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/scanWithMigration.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testRemoveSingleLineCommentsWithSymbolCommentTokens(logger) {
	const cases = [
	{'in': '', 'tokens': []},
	{'in': ';', 'tokens': []}, // different comment symbol used in this test.
	{'in': '\'', 'tokens': [
		{'s': '\'', 'colIndex': 0, 'lineIndex': 0}
	]},
	{'in': '\'\n', 'tokens': [
		{'s': '\'', 'colIndex': 0, 'lineIndex': 0}
	]},
	{'in': '\'\'\n', 'tokens': [
		{'s': '\'\'', 'colIndex': 1, 'lineIndex': 0}
	]},
	{'in': '\'\n\t\r   \n', 'tokens': [
		{'s': '\'', 'colIndex': 0, 'lineIndex': 0}
	]},
	{'in': ' \'', 'tokens': [
		{'s': '\'', 'colIndex': 1, 'lineIndex': 0}
	]},
	{'in': '\'h', 'tokens': [
		{'s': '\'h', 'colIndex': 1, 'lineIndex': 0}
	]},
	{'in': '\' hello', 'tokens': [
		{'s': '\' hello', 'colIndex': 6, 'lineIndex': 0}
	]},
	{'in': '\n\'', 'tokens': [
		{'s': '\'', 'colIndex': 0, 'lineIndex': 1}
	]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.in}`, logger);
		const [code, comments] = removeSingleLineCommentsWithSymbol(caseInfo.in, "'");
		if (comments.length !== caseInfo.tokens.length)
			plogger(`Expected ${caseInfo.tokens.length} comment(s) but found ${result.length}`);
		else {
			for (let i = 0; i < comments.length; i++) {
				const tokenInfo = caseInfo.tokens[i];
				const resToken = comments[i];
				compareScanTokens(tokenInfo, resToken, prefixWrapper(`Token ${i}`, plogger));
			}
		}
	});
}

function testRemoveSingleLineCommentsWithSymbol(logger) {
	const cases = [
		{'in': "", 'outCode': '', 'numComments': 0},
		{'in': "VOORUIT 25", 'outCode': 'VOORUIT 25', 'numComments': 0},
		{'in': "'", 'outCode': '', 'numComments': 1},
		{'in': "'\n", 'outCode': '\n', 'numComments': 1},
		{'in': "\n'", 'outCode': '\n', 'numComments': 1},
		{'in': "\n'\n", 'outCode': '\n\n', 'numComments': 1},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.in}`, logger);
		const [code, comments] = removeSingleLineCommentsWithSymbol(caseInfo.in, "'");
		assertEquals(caseInfo.outCode, code, plogger);
		if (comments.length !== caseInfo.numComments)
			plogger(`Expected ${caseInfo.numComments} but found ${comments.length}`);
	});
}

function testScanWithMigrationCases(logger) {
	const cases = [
		{'in': "", 'tokens': []},
		{'in': '"hi"', 'tokens': ['"hi']},
		{'in': '"hi world"', 'tokens': ['\'hi world\'']},
		{'in': '"hi world', 'tokens': ['\'hi world\'']},
		{'in': "VOORUIT 25", 'tokens': ['forward', '25']},
		{'in': 'VULKLEUR ROOD', 'tokens': ['setFillColor', '"red']},
		{'in': "DOE", 'tokens': [']']},
		{'in': 'HERHAAL 6\n', 'tokens': ['repeat', '6', '\n', '[']},
		{'in': 'HERHAAL 6 \' some comment\n', 'tokens': ['repeat', '6', '\n', '[', "; some comment"]},
		{'in': "'", 'tokens': [';']},
		{'in': "' this is a comment", 'tokens': ['; this is a comment']},
		{'in': 'zetletter "handschrift" 24', 'tokens': [
			'zetletter', '"handschrift', '24'
		]}
	];
	// The following mock migration information object is copying parts from
	// cheerfulNetherlandsLogo.json.
	const migrationInfo = {
		'singleLineCommentSymbol': "'",
		'longStringSymbol': '"',
		'commands': [
			{
				"primaryName": "herhaal",
				"migrateNewSymbolAtNextLineBreak": "[",
				"to": "repeat"
			},
			{
				"primaryName": "rood",
				"args": [],
				"description": "Returns the color, red",
				"returnTypes": "colorstring",
				"migrateToCode": "\"red"
			},{
				'primaryName': 'vooruit',
				'to': 'forward'
			},{
				"primaryName": "vulkleur",
				"to": "setFillColor"
			}
		],
		"keywords": [
			{"from": "doe", "toSymbol": "]"}
		],
	};
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.in}`, logger);
		const tokens = scanWithMigration(caseInfo.in, migrationInfo);
		if (!(tokens instanceof Array))
			plogger(`Expected scanWithMigration to return an Array but found ${tokens}`);
		else if (tokens.length !== caseInfo.tokens.length)
			plogger(`Expected ${caseInfo.tokens.length} tokens but found ${tokens.length}`);
		else {
			for (let i = 0; i < tokens.length; i++) {
				const expectedInfo = caseInfo.tokens[i];
				const token = tokens[i];
				compareScanTokens(expectedInfo, token, prefixWrapper(`Token ${i}, s=${token.s}`, plogger));
			}
		}
	});
}

export function testScanWithMigration(logger) {
	wrapAndCall([
		testRemoveSingleLineCommentsWithSymbol,
		testRemoveSingleLineCommentsWithSymbolCommentTokens,
		testScanWithMigrationCases
	], logger);
};