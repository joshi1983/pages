import { processScanTestCases } from '../../processScanTestCases.js';
import { scan } from '../../../../modules/parsing/css/scanning/scan.js';

export function testScan(logger) {
	const cases = [
	{'code': '', 'len': 0},
	{'code': '/* hi */', 'len': 1},
	{'code': '12.34', 'tokens': ['12.34']},
	{'code': '-12.34', 'tokens': ['-12.34']},
	{'code': '50%', 'tokens': [{'s': '50%', 'colIndex': 2, 'lineIndex': 0}]},
	{'code': '50px', 'tokens': [{'s': '50px', 'colIndex': 3, 'lineIndex': 0}]},
	{'code': '50pt', 'tokens': [{'s': '50pt', 'colIndex': 3, 'lineIndex': 0}]},
	{'code': '50vw', 'tokens': [{'s': '50vw', 'colIndex': 3, 'lineIndex': 0}]},
	{'code': '50vh', 'len': 1},
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
	{'code': 'x/y', 'tokens': ['x', '/', 'y']},
	{'code': '2-3', 'tokens': ['2', '-', '3']},
	{'code': '123-456', 'tokens': ['123', '-', '456']},
	{'code': '123+456', 'tokens': ['123', '+', '456']},
	{'code': '2+3', 'tokens': ['2', '+', '3']},
	{'code': 'text-decoration', 'len': 1},
	{'code': 'text-decoration:none', 'tokens': ['text-decoration', ':', 'none']},
	{'code': 'font-family', 'len': 1},
	{'code': 'font-family:"Arial"', 'tokens': ['font-family', ':', '"Arial"']},
	{'code': 'color:#123', 'tokens': ['color', ':', '#123']},
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
	{'code': '"\\""', 'tokens': ['"\\""']},
	{'code': "'\\''", 'tokens': ["'\\''"]},
	];
	processScanTestCases(cases, scan, logger);
};