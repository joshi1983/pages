import { processTestCases } from
'../../processTestCases.js';
import { simplifyWithArcLines } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyWithArcLines.js';

export function testSimplifyWithArcLines(logger) {
	const cases = [
		{'code': '', 'logged': false},
		{'code': 'forward 100', 'logged': false},
		{'code': 'forward 100 forward 10', 'logged': false},
		{'code': 'forward 100 right 10', 'logged': false},
		{'code': 'arcLeft 100 100', 'logged': false},
		{'code': 'forward 100 arcLeft 100 100', 'logged': false},
		{'code': 'arcRight 100 100', 'logged': false},
		{'code': 'arcRight 100 100 forward 100 setPenSize 3', 'logged': false},
		{'code': 'forward 100\nright 90\nforward 123',
			'to': `arcLines [[100]
 [-90 0]
 [123]]1`
		, 'logged': true},
		{'code': 'backward 100\nright 90\nforward 123',
			'to': `arcLines [[-100]
 [-90 0]
 [123]]1`
		, 'logged': true},
		{'code': 'forward 100\narcright 90 54\nforward 123',
			'to': `arcLines [[100]
 [-90 54]
 [123]]1`
		, 'logged': true},
		{'code': 'forward 100\narcleft 90 54\nforward 123',
			'to': `arcLines [[100]
 [90 54]
 [123]]1`
		, 'logged': true},
		{'code': `forward :i
right 50
right 40
forward 500
right 120`,
		'to': `arcLines [[:i]
 [-50 0]
 [-40 0]
 [500]
 [-120 0]]1`,
		'logged': true
		},
		{'code': `forward 3
right 50
+ 40
forward 500
right 120`,
		'to': `arcLines [[3]
 [-(50
+ 40)0]
 [500]
 [-120 0]]1`,
		'logged': true},
		{'code': `right 180
arcRight -:extent :radius
right 180`, 'to': `arcLines [[-180 0]
 [:extent :radius]
 [-180 0]]1`,
		'logged': true}
	];
	processTestCases(cases, simplifyWithArcLines, logger);
};