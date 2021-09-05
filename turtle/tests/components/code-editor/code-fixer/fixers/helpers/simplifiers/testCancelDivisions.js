import { cancelDivisions } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/cancelDivisions.js';
import { processTestCases } from
'../../processTestCases.js';

export function testCancelDivisions(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'print goldenRatio / pi', 'logged': false},
		{'code': 'print :x/:y', 'logged': false},
		{'code': 'print :y + :x/:y', 'logged': false},
		{'code': 'print :y + 2/:y', 'logged': false},
		{'code': 'print (:x+:z)*:y/:x', 'logged': false},
		{'code': 'print 2.0/3', 'logged': false},
		{'code': 'print :x/:y/:y', 'logged': false},
		{'code': 'print 3.0/3', 'to': 'print 1', 'logged': true},
		{'code': 'print 5 / 5', 'to': 'print 1  ', 'logged': true},
		{'code': 'print pi / pi', 'to': 'print 1  ', 'logged': true},
		{'code': 'print goldenRatio / goldenRatio', 'to': 'print 1  ', 'logged': true},
		{'code': 'print :x / :x', 'to': 'print 1  ', 'logged': true},
		{'code': 'print :x * :y / :x', 'to': 'print   :y  ', 'logged': true},
		{'code': 'print :x * :y / :x', 'to': 'print   :y  ', 'logged': true},
		{'code': 'print :x * :y * :z / :x', 'to': 'print   :y * :z  ', 'logged': true},
		{'code': 'print (:x * :y * :z) / :x', 'to': 'print (  :y * :z)  ', 'logged': true},
		{'code': 'print (:x * :y * :z) / (:x * :y)', 'to': 'print (    :z)    ', 'logged': true},
		{'code': 'print :x * :y * :z / :y',
			'to': 'print :x   * :z  ', 'logged': true},
		{'code': 'print :x/:y/:x', 'to': 'print 1/:y', 'logged': true},
		{'code': 'print (:x)/:y/:x', 'to': 'print 1/:y', 'logged': true},
		{'code': 'print pi/:y/pi', 'to': 'print 1/:y', 'logged': true},
		{'code': 'print 1+pi/:y/pi', 'to': 'print 1+ 1/:y', 'logged': true},
		{'code': 'print 1-pi/:y/pi', 'to': 'print 1- 1/:y', 'logged': true},
		{'code': 'print 1-pi/pi', 'to': 'print 1- 1', 'logged': true},
		{'code': 'print (:x)/:x',
		'to': 'print 1', 'logged': true},
		{'code': 'print (:x)*:y/:x',
		'to': 'print :y', 'logged': true},
		{'code': 'print :x / power :x 1',
		'to': 'print 1    ', 'logged': true},
		{'code': 'print :x * :x / power :x 2',
		'to': 'print  1     ', 'logged': true},
		{'code': 'print :x * :x * :x / power :x 3',
		'to': 'print    1     ', 'logged': true},
		{'code': 'print :x * :x * :x / power :x 2',
		'to': 'print     :x    ', 'logged': true},
	];
	processTestCases(cases, cancelDivisions, logger);
};