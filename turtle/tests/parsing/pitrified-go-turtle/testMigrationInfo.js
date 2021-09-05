import { assertEquals } from
'../../helpers/assertEquals.js';
import { findToken } from
'../../helpers/findToken.js';
import { flatten } from
'../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getImportedPathsFrom } from
'../../../modules/parsing/pitrified-go-turtle/parsing/parse-tree-analysis/getImportedPathsFrom.js';
import { MigrationInfo } from
'../../../modules/parsing/pitrified-go-turtle/MigrationInfo.js';
import { parse } from
'../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

function processCases(cases, func, logger) {
	cases.forEach(function(caseInfo, index) {
		if (caseInfo.expected !== undefined)
			caseInfo.found = true;
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const token = findToken(caseInfo.token, tokens, plogger);
		if (token !== undefined) {
			const settings = {
				'imports': getImportedPathsFrom(parseResult.root)
			};
			const result = func(token, settings);
			if (caseInfo.found === false) {
				if (result !== undefined)
					plogger(`Expected to not find any info but found ${result}`);
			}
			else if (result === undefined) {
				plogger(`Expected to find information but did not`);
			}
			else {
				const expected = caseInfo.expected;
				if (expected !== undefined) {
					for (const key in expected) {
						assertEquals(expected[key], result[key], prefixWrapper(`Comparing ${key}`, plogger));
					}
				}
			}
		}
	});
}

function testGetConstantInfo(logger) {
	const cases = [
		{
			'code': 'E=3;\nfmt.Println(E)',
			'token': {
				'val': 'E',
				'hasParentType': ParseTreeTokenType.ARG_LIST
			},
			'found': false
		},
		{
			'code': 'import "math"\nfmt.Println(math.E)',
			'token': {
				'val': null,
				'hasChildVal': 'math',
				'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY
			},
			'expected': {
				'name': 'E',
				'package': 'math'
			}
		}
	];
	processCases(cases, MigrationInfo.getConstantInfo, logger);
}

function testGetFunctionInfo(logger) {
	const cases = [
		{
			'code': 'import "fmt"\nfmt.Println("hi")',
			'token': {
				'type': ParseTreeTokenType.FUNC_CALL
			},
			'expected': {
				'name': 'Println'
			}
		}
	];
	processCases(cases, MigrationInfo.getFunctionInfo, logger);
}

export function testMigrationInfo(logger) {
	wrapAndCall([
		testGetConstantInfo,
		testGetFunctionInfo,
	], logger);
};