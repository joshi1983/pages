import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { parse } from '../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeToken } from '../../../modules/parsing/generic-parsing-utilities/ParseTreeToken.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
const operators = await fetchJson('json/JavaScript/operators.json');
const reservedWords = await fetchJson('json/JavaScript/ReservedWords.json');

/*
Parses various erroneous JavaScript to verify that no errors get thrown
*/
export function testParseErroneousJavaScript(logger) {
	const cases = [
		'(', '[', '{', ']', '}', ')', '))', '())', '...',':', '?', '?:', ':?','#',
		'!{x}','a++++',
		'arr.0', // invalid according to https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
		'async',
		'await',
		'break',
		'case',
		'case 1:',
		'case console.log("hi"):',
		'catch',
		'continue',
		'default',
		'do',
		'else',
		'else if',
		'else if {}',
		'finally',
		'finally {}',
		'function',
		'if',
		'switch',
		'try',
		'when',
		'with',
		'while'
	];
	ArrayUtils.pushAll(cases, operators.map(o => o.symbol));
	ArrayUtils.pushAll(cases, reservedWords.map(w => w.name));
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo;
		const plogger = prefixWrapper(`Case ${index}, code = ${code}`, logger);
		const parseResult = parse(code);
		if (typeof parseResult !== 'object' || parseResult === null)
			plogger(`Expected a non-null object but got ${parseResult}`);
		else if (!(parseResult.root instanceof ParseTreeToken))
			plogger(`Expected root to be a ParseTreeToken but got ${parseResult.root}`);
	});
};