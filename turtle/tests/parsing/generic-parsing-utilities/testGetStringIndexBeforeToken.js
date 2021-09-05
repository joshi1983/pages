import { findToken } from
'../../helpers/findToken.js';
import { flatten } from
'../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getStringIndexBeforeToken } from
'../../../modules/parsing/generic-parsing-utilities/getStringIndexBeforeToken.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';

export function testGetStringIndexBeforeToken(logger) {
	const cases = [
		{
			'code': 'to p',
			'subcases': [
				{
					'token': {'val': 'to'},
					'out': 0
				},
				{
					'token': {'val': 'p'},
					'out': 'to '.length
				}
			]
		},
		{
			'code': '; some comment\nto p',
			'subcases': [
				{
					'token': {'val': 'to'},
					'out': '; some comment\n'.length
				}
			]
		},
		{
			'code': '123',
			'subcases': [
				{
					'token': {'val': 123},
					'out': 0
				}
			]
		},
		{
			'code': 'true',
			'subcases': [
				{
					'token': {'val': true},
					'out': 0
				}
			]
		},
		{
			'code': ' true',
			'subcases': [
				{
					'token': {'val': true},
					'out': 1
				}
			]
		},
		{
			'code': 'false',
			'subcases': [
				{
					'token': {'val': false},
					'out': 0
				}
			]
		},
		{
			'code': '\n[',
			'subcases': [
				{
					'token': {'val': '['},
					'out': 1
				}
			]
		},
		{
			'code': '\n\t[',
			'subcases': [
				{
					'token': {'val': '['},
					'out': 2
				}
			]
		},
		{
			'code': '\n\n\t[',
			'subcases': [
				{
					'token': {'val': '['},
					'out': 3
				}
			]
		},
		{
			'code': '\n\n\n\t[',
			'subcases': [
				{
					'token': {'val': '['},
					'out': 4
				}
			]
		},
		{
			'code': 'to p\nend',
			'subcases': [
				{
					'token': {'val': 'end'},
					'out': 'to p\n'.length
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
			const result = getStringIndexBeforeToken(token, caseInfo.code);
			if (result !== subcaseInfo.out)
				slogger(`Expected ${subcaseInfo.out} but found ${result}`);
		});
	});
};