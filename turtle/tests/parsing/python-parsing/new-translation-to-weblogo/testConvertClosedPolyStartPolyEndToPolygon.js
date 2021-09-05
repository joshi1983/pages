import { convertClosedPolyStartPolyEndToPolygon } from
'../../../../modules/parsing/python-parsing/new-translation-to-weblogo/convertClosedPolyStartPolyEndToPolygon.js';
import { processTestCases } from
'../../../components/code-editor/code-fixer/fixers/processTestCases.js';

export function testConvertClosedPolyStartPolyEndToPolygon(logger) {
	const cases = [
		{'code': 'polyStart', 'logged': false},
		{'code': 'polyStart polyEnd', 'logged': false},
		{'code': 'polyStart penUp polyEnd', 'logged': false},
		{'code': 'polyStart jumpTo [0 0] polyEnd', 'logged': false},
		{'code': 'polyStart jumpTo [0 0] jumpTo [0 100] jumpTo [0 0]', 'logged': false},
		{'code': 'polyStart jumpTo [0 0] jumpTo [0 100] jumpTo [0 0] polyEnd', 'logged': false},
		{'code': 'polyStart jumpTo :x jumpTo [0 100] jumpTo [100 100] jumpTo :y polyEnd',
		'logged': false},
		{'code': 'polyStart jumpTo :x jumpTo [0 100] jumpTo [100 100] jumpTo [] polyEnd',
		'logged': false},
		{'code': 'polyStart jumpTo [] jumpTo [0 100] jumpTo [100 100] jumpTo :x polyEnd',
		'logged': false},
		{'code': 'polyStart jumpTo [:x :y] jumpTo [0 100] jumpTo [100 100] jumpTo [:y :x] polyEnd',
		'logged': false},
		{'code': `to p
	jumpForward 100 ; extra side effect that complicates a refactor to use the polygon command
	output 10
end
polyStart jumpTo [0 0] jumpTo [p 100] jumpTo [100 100] jumpTo [0 0] polyEnd`,
		'logged': false},
		{'code': 'polyStart jumpTo [0 0] jumpTo [0 100] jumpTo [100 100] jumpTo [0 0] polyEnd',
			'to': 'polygon [    [0 100]  [100 100]  [0 0] ]',
		'logged': true},
		{'code': 'polyStart jumpTo :x jumpTo [0 100] jumpTo [100 100] jumpTo :x polyEnd',
			'to': 'polygon [   [0 100]  [100 100]  :x ]',
		'logged': true},
		{'code': 'polyStart jumpTo [:x :y] jumpTo [0 100] jumpTo [100 100] jumpTo [:x :y] polyEnd',
			'to': 'polygon [    [0 100]  [100 100]  [:x :y] ]',
		'logged': true}
	];
	processTestCases(cases, convertClosedPolyStartPolyEndToPolygon, logger);
};