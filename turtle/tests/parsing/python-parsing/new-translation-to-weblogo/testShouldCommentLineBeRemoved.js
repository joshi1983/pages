import { processTranslationTestCases } from './processTranslationTestCases.js';
import { shouldCommentLineBeRemoved } from
'../../../../modules/parsing/python-parsing/new-translation-to-weblogo/shouldCommentLineBeRemoved.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testDirectly(logger) {
	const cases = [
	{'in': 'hello', 'out': false},
	{'in': 'hello world', 'out': false},
	{'in': 'python', 'out': false},
	{'in': '!/usr/bin/env', 'out': false},
	{'in': '!/usr/bin/env python', 'out': true},
	{'in': '!/usr/bin/python', 'out': true},
	{'in': '!/usr/bin/python3.4', 'out': true},
	{'in': '!/usr/lib/python2.7', 'out': true},
	{'in': '!/usr/lib/python3.4', 'out': true},
	{'in': '!/usr/include/python2.7', 'out': true},
	{'in': '!/usr/include/python3.4m', 'out': true},
	];
	testInOutPairs(cases, shouldCommentLineBeRemoved, logger);
}

function testTranslation(logger) {
	const cases = [
		{'in': 'print(None)', 'out': 'print "None'},
		{'in': '# hello\nprint(None)', 'out': '; hello\nprint "None'},
		{'in': '#!/usr/bin/env python\nprint(None)', 'out': 'print "None'},
		{'in': '#!/usr/bin/python\nprint(None)', 'out': 'print "None'},
	];
	processTranslationTestCases(cases, logger);
}

export function testShouldCommentLineBeRemoved(logger) {
	wrapAndCall([
		testDirectly,
		testTranslation
	], logger);
};