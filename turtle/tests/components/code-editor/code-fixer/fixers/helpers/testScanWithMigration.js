import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { getSingleLineCommentsStartingWith,
removeSingleLineCommentsWithSymbol } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/scanWithMigration.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testGetSingleLineCommentsStartingWith(logger) {
	const cases = [
	{'in': '', 'tokens': []},
	{'in': ';', 'tokens': []}, // different comment symbol used in this test.
	{'in': '\'', 'tokens': [
		{'s': '\'', 'colIndex': 0, 'lineIndex': 0}
	]},
	{'in': '\'\n', 'tokens': [
		{'s': '\'', 'colIndex': 0, 'lineIndex': 0}
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
		const result = getSingleLineCommentsStartingWith(caseInfo.in, "'");
		if (result.length !== caseInfo.tokens.length)
			plogger(`Expected ${caseInfo.tokens.length} comment(s) but found ${result.length}`);
		else {
			for (let i = 0; i < result.length; i++) {
				const tokenInfo = caseInfo.tokens[i];
				const resToken = result[i];
				const tplogger = prefixWrapper(`Token ${i}`, plogger);
				let s;
				if (typeof tokenInfo === 'string')
					s = tokenInfo;
				else {
					s = tokenInfo.s;
					if (tokenInfo.colIndex !== undefined &&
					tokenInfo.colIndex !== resToken.colIndex) {
						tplogger(`Expected colIndex to be ${tokenInfo.colIndex} but found ${resToken.colIndex}`);
					}
					if (tokenInfo.lineIndex !== undefined &&
					tokenInfo.lineIndex !== resToken.lineIndex) {
						tplogger(`Expected lineIndex to be ${tokenInfo.lineIndex} but found ${resToken.lineIndex}`);
					}
				}
				if (s !== undefined) {
					if (resToken.s !== s)
						tplogger(`s expected to be "${s}" but found "${resToken.s}"`);
				}
			}
		}
	});
}

function testRemoveSingleLineCommentsWithSymbol(logger) {
	const cases = [
		/*{'in': "", 'outCode': '', 'numComments': 0},
		{'in': "'", 'outCode': '', 'numComments': 1},
		*/{'in': "'\n", 'outCode': '\n', 'numComments': 1},
		/*{'in': "\n'", 'outCode': '\n', 'numComments': 1},
		{'in': "\n'\n", 'outCode': '\n\n', 'numComments': 1},*/
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.in}`, logger);
		const [code, comments] = removeSingleLineCommentsWithSymbol(caseInfo.in, "'");
		assertEquals(caseInfo.outCode, code, plogger);
		if (comments.length !== caseInfo.numComments)
			plogger(`Expected ${caseInfo.numComments} but found ${comments.length}`);
	});
}

export function testScanWithMigration(logger) {
	wrapAndCall([
		testGetSingleLineCommentsStartingWith,
		testRemoveSingleLineCommentsWithSymbol
	], logger);
};