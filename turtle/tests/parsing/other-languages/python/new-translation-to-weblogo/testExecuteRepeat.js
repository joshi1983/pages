import { processTranslateExecuteCases } from './processTranslateExecuteCases.js';

/*
These repeat statements are not part of standard Python.

These repeat statements are supported because they were found in an examples and an interpreter at:
https://csinschools.io/lessons/introduction-to-turtle-graphics/

We're not testing more than very simple repeat <count>: format because 
repeat-statements don't seem valuable enough to be worth better support.

If these repeat statements ever become important enough to support complex expressions in the repeat count,
I would do the following:
1. Add a REPEAT token type to Python's ParseTreeTokenType.
2. Select the REPEAT token type in parsing/stringToParseTreeTokenType.js.
	Avoid selecting that type inappropriately in code like x.repeat()
	or class repeat:
	or def repeat():.
3. Test that repeat statements are parsed intuitively.
4. Change the translation code to process the new REPEAT tokens properly.
5. Check if any parse tree analysis should to be updated with respect to the new REPEAT tokens.
6. Add several more complex test cases here including complex expressions, function calls... in the repeat limit.
7. Remove the scanning/token-sanitizers/fixRepeat.js and make sure corresponding testFixRepeat.js test cases
are covered by this file.  The scanner shouldn't be converting repeat statements after they can be appropriately parsed and translated.
*/
export function testExecuteRepeat(logger) {
	const cases = [
		{'code': 'repeat 1:\n\tprint("hi")',
			'messages': ['hi']
		},
		{'code': 'repeat 2:\n\tprint("hi")',
			'messages': ['hi', 'hi']
		}
	];
	processTranslateExecuteCases(cases, logger);
};