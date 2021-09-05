import { exceptionToString } from '../../../../modules/exceptionToString.js';
import { parse } from '../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { PythonOperators } from
'../../../../modules/parsing/python-parsing/PythonOperators.js';
import { tokenToWebLogoCode } from
'../../../../modules/parsing/python-parsing/new-translation-to-weblogo/tokenToWebLogoCode.js';

/*
The translation should never throw an error.
This test verifies that.  
This test passes mostly invalid Python code to the translator because that is
the most likely code to cause a problem and the least tested by other tests.
*/
export function testTranslateBadCode(logger) {
	const cases = [
		'class', 'def', 'yield', 'return', 
		'(', ')', '[', ']', '{', '}', '#',
		'(]', '[)', '{]', '{)', '[}',
		'***', '===',
	'import turtle\nbla',
	'bla(',
	'bla)',
	'4:=3','x:=3',':=4',
	'x=',
	'x=#',
	`print(side % (reverseDirection * 2) == 0)`,
`angle 119
side = 0
limit - 600
shape(angle, side, limit)`,
`import turtle
import random

angle 119
side = 0
limit - 600
shape(angle, side, limit)`
	];
	for (const info of PythonOperators.getAll()) {
		cases.push(info.symbol);
		cases.push('=' + info.symbol);
		cases.push(info.symbol + info.symbol);
		cases.push('x' + info.symbol);
		cases.push(info.symbol+'x');
	}
	
	cases.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, Python code=${code}`, logger);
		try {
			const parseResult = parse(code);
			if (parseResult.root === undefined) {
				plogger('Expected to get a parse tree but got a root of undefined');
				return;
			}
			const result = tokenToWebLogoCode(parseResult.root, parseResult.comments, false);
			if (typeof result !== 'string') {
				plogger(`Expected translation result to be a string but found ${result}`);
			}
		} catch (e) {
			console.error(e);
			plogger(`Failed to parse and translate with an exception e=${exceptionToString(e)}`);
		}
	});
};