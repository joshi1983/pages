import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { formatCode } from
'../../../../../../modules/components/code-editor/format/formatCode.js';
import { getAllDescendentsAsArray } from
'../../../../../../modules/parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getCachedParseTreeFromCode } from
'../../../../../helpers/getCachedParseTreeFromCode.js';
import { harmonizeCase } from
'../../../../../../modules/components/code-editor/harmonize-case/harmonizeCase.js';
import { parseTreeToCodeWithComments } from
'../../../../../../modules/parsing/parseTreeToCodeWithComments.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';
import { processMigrateToCode, replaceToken } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/processMigrateToCode.js';
import { processMigrationTestCases } from './processMigrationTestCases.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';
import { WriteOptimizedCachedParseTree } from
'../../../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

function testReplaceToken(logger) {
	const cases = [
	{
		'code': 'print x',
		'token': {
			'val': 'x'
		},
		'withCode': '4',
		'out': 'print 4'
	},
	{
		'code': 'print timemilli - :start',
		'token': {
			'val': 'timemilli'
		},
		'withCode': '(animation.time * 1000)',
		'out': 'print ( animation.time * 1000 ) - :start'
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger).root;
		const wtree = new WriteOptimizedCachedParseTree(tree, caseInfo.code);
		const allTokens = getAllDescendentsAsArray(tree);
		const token = findToken(caseInfo.token, allTokens, plogger);
		replaceToken(token, caseInfo.withCode, wtree);
		const fixedCode = parseTreeToCodeWithComments(tree, caseInfo.code);
		const formatted = formatCode(harmonizeCase(fixedCode));
		const outCode = formatted.trim();
		assertEquals(caseInfo.out, outCode, plogger);

		const afterTree = getCachedParseTreeFromCode(fixedCode, plogger).root;
		const afterAllTokens = getAllDescendentsAsArray(afterTree);
		if (caseInfo.checks instanceof Array) {
			caseInfo.checks.forEach(function(checkInfo, checkIndex) {
				const token = findToken(checkInfo.token, afterAllTokens, plogger);
				if (token !== undefined) {
					const clogger = prefixWrapper(`Check ${checkIndex}`, plogger);
					if (checkInfo.colIndex !== undefined && checkInfo.colIndex !== token.colIndex)
						clogger(`Expected ${checkInfo.colIndex} as colIndex but found ${token.colIndex}`);
					if (checkInfo.lineIndex !== undefined && checkInfo.lineIndex !== token.lineIndex)
						clogger(`Expected ${checkInfo.lineIndex} as lineIndex but found ${token.lineIndex}`);
				}
			});
		}
	});
}

function generalCases(logger) {
	const migrationInfo1 = {
		'commands': [
			{
				"primaryName": "timemilli",
				"args": [],
				"migrateToCode": "(animation.time * 1000)"
			}
		]
	};
	const cases = [
	{'code': 'print timemilli',
	'migrationInfo': migrationInfo1,
	'out': 'print ( animation.time * 1000 )'},
	{'code': 'print timemilli - :start',
	'migrationInfo': migrationInfo1,
	'out': 'print ( animation.time * 1000 ) - :start'},
	{'code': 'print (timemilli - :start)',
	'migrationInfo': migrationInfo1,
	'out': 'print ( ( animation.time * 1000 ) - :start )'},
	{'code': 'print (timemilli - :start) / 1000',
	'migrationInfo': migrationInfo1,
	'out': 'print ( ( animation.time * 1000 ) - :start ) / 1000'},
	];
	processMigrationTestCases(cases, logger, processMigrateToCode);
}

export function testProcessMigrateToCode(logger) {
	wrapAndCall([
		generalCases,
		testReplaceToken
	], logger);
};