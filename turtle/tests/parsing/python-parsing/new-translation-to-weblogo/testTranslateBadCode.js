import { parse } from '../../../../modules/parsing/python-parsing/parsing/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { tokenToWebLogoCode } from '../../../../modules/parsing/python-parsing/new-translation-to-weblogo/tokenToWebLogoCode.js';

export function testTranslateBadCode(logger) {
	const cases = [
		'class', 'def', 'yield', 'return', 
		'(', ')', '[', ']', '{', '}', '#',
		'-', '*', '/', '//', '^', '**', '%',
		'and', 'not', 'or', 'xor'
	];
	cases.forEach(function(code, index) {
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