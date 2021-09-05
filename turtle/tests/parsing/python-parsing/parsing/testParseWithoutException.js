import { parse } from
'../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { PythonOperators } from
'../../../../modules/parsing/python-parsing/PythonOperators.js';

/*
We don't want the parser to throw an error or exception no matter what string is passed to it.

This test parses some weird and invalid Python code because 
those are more likely to reproduce bugs.
*/
export function testParseWithoutException(logger) {
	const cases = [
	'.x', ';x', '()', '[]', '(,)', '(.)', '(;)', '[.]', '[;]', '{.}', '{,}', '{;}'
	];
	for (const ch of '.,<>/~!@#$%^&*()[]{}-+'.split(''))
		cases.push(ch);
	for (const info of PythonOperators.getAll()) {
		cases.push(info.symbol);
		cases.push(info.symbol + info.symbol);
		cases.push('x ' + info.symbol);
		cases.push('x' + info.symbol);
		cases.push('x ' + info.symbol + ' y');
		cases.push('x,' + info.symbol);
		cases.push('x =' + info.symbol);
		cases.push('x = ' + info.symbol);
	}
	cases.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = parse(code);
			if (typeof result !== 'object')
				plogger(`object expected but found ${result}`);
		}
		catch (e) {
			plogger(`Error or exception thrown.  e=${exceptionToString(e)}`);
		}
	});
};