import { findToken } from
'../../helpers/findToken.js';
import { flatten } from
'../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getStringIndexAfterToken } from
'../../../modules/parsing/generic-parsing-utilities/getStringIndexAfterToken.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';

export function testGetStringIndexAfterToken(logger) {
	const cases = [
		{
			'code': 'to p',
			'subcases': [
				{
					'token': {'val': 'to'},
					'out': 'to'.length
				},
				{
					'token': {'val': 'p'},
					'out': 'to p'.length
				}
			]
		},
		{
			'code': '; some comment\nto p',
			'subcases': [
				{
					'token': {'val': 'to'},
					'out': '; some comment\nto'.length
				}
			]
		},
		{
			'code': '123',
			'subcases': [
				{
					'token': {'val': 123},
					'out': '123'.length
				}
			]
		},
		{
			'code': 'true',
			'subcases': [
				{
					'token': {'val': true},
					'out': 'true'.length
				}
			]
		},
		{
			'code': ' true',
			'subcases': [
				{
					'token': {'val': true},
					'out': ' true'.length
				}
			]
		},
		{
			'code': '\n[',
			'subcases': [
				{
					'token': {'val': '['},
					'out': 2
				}
			]
		},
		{
			'code': '\n\t[',
			'subcases': [
				{
					'token': {'val': '['},
					'out': 3
				}
			]
		},
		{
			'code': 'to p\nend',
			'subcases': [
				{
					'token': {'val': 'p'},
					'out': 'to p'.length
				}
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const testParseLogger = new TestParseLogger(plogger, caseInfo.code);
		const tree = LogoParser.getParseTree(caseInfo.code, testParseLogger,);
		const tokens = flatten(tree);
		caseInfo.subcases.forEach(function(subcaseInfo, sIndex) {
			const slogger = prefixWrapper(`Subcase ${sIndex}`, plogger);
			const token = findToken(subcaseInfo.token, tokens, slogger);
			if (token === undefined)
				return;
			const result = getStringIndexAfterToken(token, caseInfo.code);
			if (result !== subcaseInfo.out)
				slogger(`Expected ${subcaseInfo.out} but found ${result}`);
		});
	});
};