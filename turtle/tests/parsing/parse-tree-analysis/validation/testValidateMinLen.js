import { processValidationTestCase } from './processValidationTestCase.js';
import { validateMinLen } from '../../../../modules/parsing/parse-tree-analysis/validation/validateMinLen.js';

export function testValidateMinLen(logger) {
	const cases = [
		{'code': '', 'error': false},
		{'code': 'print pick [1]', 'error': false},
		{'code': 'print pick [1 2]', 'error': false},
		{'code': 'print pick []', 'error': true},
		{'code': 'print first []', 'error': true},
		{'code': 'print first [3]', 'error': false},
		{'code': 'print first [random 3]', 'error': false},
		{'code': 'print first "', 'error': true},
		{'code': 'print first "Hello', 'error': false},
		{'code': 'make "p []\nprint item 1 :p', 'error': true},
		{'code': 'print item 1 "', 'error': true},
		{'code': 'repeat 2 [\nprint item 1 "\n]', 'error': true},
		{'code': 'to addElement :mylist\nqueue2 "mylist 5\nend\nmake "mylist1 []\naddElement :mylist1\nprint item 1 :mylist1', 'error': false},
		/*
		queue2 adds an element to the list so it should not cause a problem when the print statement runs.
		*/
		{'code': 'to addElement :mylist\nqueue2 "mylist 5\nend\nto p1\nlocalmake "mylist1 []\naddElement :mylist1\nprint item 1 :mylist1\nend\np1', 'error': false},
		/*
		queue2 adds an element to the list so it should not cause a problem when the print statement runs.
		*/
		{'code': 'to addElement :mylist\nqueue "mylist 5\nend\nto p1\nlocalmake "mylist1 []\naddElement :mylist1\nprint item 1 :mylist1\nend\np1', 'error': true},
		/*
		queue creates a new instance of the Array so it won't mutate the caller's instance.
		Therefore, item is called with an empty list so we should expect a validation error.
		*/
			{'code': `to p
	localmake "row []
	setItem 1 "row 5
end`, 'error': false},
	{'code': `to p
	localmake "row []
	queue2 "row 3
end

make "list1 []
print item 1 :list1
`, 'error': true},
	{'code': `make "list1 []
queue2 "list1 5
print item 1 :list1
`, 'error': false}
/*
The queue2 should make list1 long enough to satisfy item's minimum length by the time item runs.
*/
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processValidationTestCase(caseInfo, logger, validateMinLen);
	});
};