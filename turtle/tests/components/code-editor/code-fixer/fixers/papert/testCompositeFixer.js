import { compositeFixer } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/papert/compositeFixer.js';
import { papertExamples } from
'../../../../../helpers/parsing/papertExamples.js';
import { processTestCases } from '../processTestCases.js';
import { processNoJavaScriptErrorsWhileFixing } from
'../processNoJavaScriptErrorsWhileFixing.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function fixExamplesWithoutJavaScriptError(logger) {
	processNoJavaScriptErrorsWhileFixing(papertExamples, compositeFixer, logger);
}

function testCompositeFixerInOut(logger) {
	const cases = [
	{'code': '', 'logged': false},
	{'code': 'fd 100', 'logged': false},
	{'code': 'setPenSize 100', 'logged': false},
	{'code': 'reset', 'to': '', 'logged': true},
	{'code': 'color [255 0 100]', 'to': 'setPenColor [255 0 100]', 'logged': true},
	{'code': 'colour [255 0 100]', 'to': 'setPenColor [255 0 100]', 'logged': true},
	{'code': 'penwidth 1', 'to': 'setPenSize 1', 'logged': true},
	{'code': 'print minus :x', 'to': 'print  -:x', 'logged': true, 'ignoreParseErrors': true},
	{'code': 'print int :x', 'to': 'print floor :x', 'logged': true},
	{'code': 'print 1 != 2', 'to': 'print 1 <> 2', 'logged': true},
	{'code': 'print :x%:y', 'to': 'print modulo :x :y', 'logged': true},
	{'code': `to p
global "factors
end`, 'to': `to p
 
end`, 'logged': true},
	];
	processTestCases(cases, compositeFixer, logger);
}

export function testCompositeFixer(logger) {
	wrapAndCall([
		fixExamplesWithoutJavaScriptError,
		testCompositeFixerInOut
	], logger);
};