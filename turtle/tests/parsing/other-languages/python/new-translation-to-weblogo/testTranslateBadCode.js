import { badCodeExamples } from
'../badCodeExamples.js';
import { exceptionToString } from '../../../../../modules/exceptionToString.js';
import { parse } from '../../../../../modules/parsing/other-languages/python/parsing/parse.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { tokenToWebLogoCode } from
'../../../../../modules/parsing/other-languages/python/new-translation-to-weblogo/tokenToWebLogoCode.js';

/*
The translation should never throw an error.
This test verifies that.  
This test passes mostly invalid Python code to the translator because that is
the most likely code to cause a problem and the least tested by other tests.
*/
export function testTranslateBadCode(logger) {
	badCodeExamples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, Python code=${code}`, logger);
		try {
			const parseResult = parse(code);
			if (parseResult.root === undefined) {
				plogger('Expected to get a parse tree but got a root of undefined');
				return;
			}
			const result = tokenToWebLogoCode(parseResult.root, parseResult.comments, false);
			if (typeof result !== 'string') {
				plogger(`Expected translation result to be a string but found ${result}`);
			}
		} catch (e) {
			console.error(e);
			plogger(`Failed to parse and translate with an exception e=${exceptionToString(e)}`);
		}
	});
};