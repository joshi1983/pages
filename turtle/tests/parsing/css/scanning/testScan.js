import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/css/scanning/scan.js';

export function testScan(logger) {
	const cases = [
	{'code': '', 'len': 0},
	{'code': '/* hi *\/', 'tokens': [{'s': '/* hi *\/', 'colIndex': 7}]},
	{'code': '12.34', 'tokens': ['12.34']},
	{'code': '-12.34', 'tokens': ['-12.34']},
	{'code': '50%', 'tokens': [{'s': '50%', 'colIndex': 2, 'lineIndex': 0}]},
	{'code': '50px', 'tokens': [{'s': '50px', 'colIndex': 3, 'lineIndex': 0}]},
	{'code': '50pt', 'tokens': [{'s': '50pt', 'colIndex': 3, 'lineIndex': 0}]},
	{'code': '50vw', 'tokens': [{'s': '50vw', 'colIndex': 3, 'lineIndex': 0}]},
	{'code': '50vh', 'tokens': ['50vh']},
	{'code': '#123', 'tokens': [{'s': '#123', 'colIndex': 3, 'lineIndex': 0}]},
	{'code': '#112233', 'len': 1},
	{'code': '.x', 'tokens': [
		{'s': '.x', 'colIndex': 1, 'lineIndex': 0}
	]},
	{'code': '#x', 'tokens': ['#x']},
	{'code': 'x,y', 'tokens': ['x', ',', 'y']},
	{'code': 'x+y', 'tokens': ['x', '+', 'y']},
	{'code': 'x*y', 'tokens': ['x', '*', 'y']},
	{'code': 'x>y', 'tokens': ['x', '>', 'y']},
	{'code': '2-3', 'tokens': [
		{'s': '2', 'colIndex': 0},
		{'s': '-', 'colIndex': 1},
		{'s': '3', 'colIndex': 2}
	]},
	{'code': '123-456', 'tokens': [
		{'s': '123', 'colIndex': 2},
		{'s': '-', 'colIndex': 3},
		{'s': '456', 'colIndex': 6}
	]},
	{'code': '123+456', 'tokens': ['123', '+', '456']},
	{'code': '2+3', 'tokens': ['2', '+', '3']},
	{'code': 'text-decoration', 'tokens': ['text-decoration']},
	{'code': 'text-decoration:none', 'tokens': ['text-decoration', ':', 'none']},
	{'code': 'font-family', 'tokens': ['font-family']},
	{'code': 'font-family:"Arial"', 'tokens': ['font-family', ':', '"Arial"']},
	{'code': 'color:#123', 'tokens': ['color', {'s': ':', 'colIndex': 5},
		{'s': '#123', 'colIndex': 9}]},
	{'code': 'color: #123', 'tokens': ['color', ':', '#123']},
	{'code': 'rgb(12,200,400)',
		'tokens': [
		'rgb', '(', '12', ',', '200', ',', '400', ')'
		]},
	{'code': 'rgb(12, 200, 400)',
		'tokens': [
		'rgb', '(', '12', ',', '200', ',', '400', ')'
		]},
	{'code': 'rgb(12 200 400)',
	// a little quirky for CSS but we still want the scanner to handle it gracefully.
		'tokens': [
		'rgb', '(', '12', '200', '400', ')'
		]},
		{'code': `:root {
  --main-bg-color: brown;
}`, 'tokens': [':root', '{', '--main-bg-color', ':', 'brown', ';', '}']},
	{'code': 'sin(pi / 2)', 'tokens': ['sin', '(', 'pi', '/', '2', ')']},
	{'code': 'device-cmyk(0 81% 81% 30%)', 'tokens': ['device-cmyk', '(', '0', '81%', '81%', '30%', ')']},
	{'code': 'a[title]', 'tokens': ['a', '[', 'title', ']']},
	{'code': 'a[href="https://example.org"]', 'tokens': ['a', '[', 'href', '=', '"https://example.org"', ']']},
	{'code': 'a[href*="example"]', 'tokens': ['a', '[', 'href', '*=', '"example"', ']']},
	{'code': 'a[href$=".org" i]', 'tokens': ['a', '[', 'href', '$=', '".org"', 'i', ']']},
	{'code': 'a[class~="logo"]', 'tokens': ['a', '[', 'class', '~=', '"logo"', ']']},
	{'code': 'object[type^="image/"]', 'tokens': ['object', '[', 'type', '^=', '"image/"', ']']},
	{'code': '[foo|att=val]', 'tokens': ['[', 'foo', '|', 'att', '=', 'val', ']']},
	{'code': '[*|att=val]', 'tokens': ['[', '*', '|', 'att', '=', 'val', ']']},
	{'code': 'h1,.special { color: blue;}', 'tokens': ['h1', ',', '.special', '{', 'color', ':', 'blue', ';', '}']},
	{'code': 'h1#chapter1', 'tokens': ['h1', '#chapter1']},
	{'code': 'h1,h2', 'tokens': ['h1', ',', 'h2']},
	{'code': 'h1,#my', 'tokens': ['h1', ',', '#my']},
	{'code': 'p.pastoral.marine', 'tokens': ['p', '.pastoral', '.marine']},
	{'code': 'p.note:target', 'tokens': ['p', '.note', ':target']},
	{'code': '30em <= width', 'tokens': ['30em', '<=', 'width']},
	{'code': '30em <= width <= 50em', 'tokens': ['30em', '<=', 'width', '<=', '50em']},
	{'code': '||td', 'tokens': ['||', 'td']},
	{'code': '.selected||td', 'tokens': ['.selected', '||', 'td']},
	{'code': '"\\""', 'tokens': [{'s': '"\\""', 'colIndex': 3}]},
	{'code': "'\\''", 'tokens': ["'\\''"]},
	{'code': '!important', 'tokens': ['!important']},
	{'code': 'background-color: red !important;',
		'tokens': [
			'background-color', ':',
			'red', '!important', ';'
		]
	},
	{'code': 'calc(2*3-2)', 'tokens': [
		{'s': 'calc', 'colIndex': 3}, 
		{'s': '(', 'colIndex': 4},
		{'s': '2', 'colIndex': 5},
		{'s': '*', 'colIndex': 6},
		{'s': '3', 'colIndex': 7},
		{'s': '-', 'colIndex': 8},
		{'s': '2', 'colIndex': 9},
		{'s': ')', 'colIndex': 10}]},
	{'code': 'sign(-1)', 'tokens': [
		{'s': 'sign', 'colIndex': 3},
		{'s': '(', 'colIndex': 4},
		{'s': '-1', 'colIndex': 6},
		{'s': ')', 'colIndex': 7}]},
	{'code': '(../bla.eot)',
		'tokens': [
		'(',
		{'s': '../bla.eot', 'colIndex': 10},
		{'s': ')', 'colIndex': 11}
	]},
	{'code': '(../fa-brands-400.eot)',
		'tokens': [
		'(', '../fa-brands-400.eot', ')'
	]},
	{'code': '(./fa-brands-400.eot)',
		'tokens': [
		'(', './fa-brands-400.eot', ')'
	]},
	{'code': '(/fa-brands-400.eot)',
		'tokens': [
		'(', '/fa-brands-400.eot', ')'
	]},
	{'code': '.fa-lg{vertical-align:-.0667em}',
		'tokens': ['.fa-lg', '{', 'vertical-align', ':', '-.0667em', '}'
	]}
	];
	processScanTestCases(cases, scan, logger);
};