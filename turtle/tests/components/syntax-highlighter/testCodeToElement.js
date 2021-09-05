import { codeToElement } from '../../../modules/components/syntax-highlighter/codeToElement.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testWithVariousCodes(logger) {
	const codes = [
		'', 'fd 100', 'fd', '[', ']', '{',
		'to p :x\nend', 'repeat 5 [\nfd 10 right 20]',
		'; hello', ';hello', 'fd 100; hello',
		'print (sum 1 2 3)',
		'\nimageAlpha 100 100 \'local://twitter.svg\' 0.5\n',
	];
	codes.forEach(function(code) {
		const result = codeToElement(code, undefined, undefined, 'test-code-to-element');
		if (typeof result !== 'object')
			logger('codeToElement should return undefined or an object but got something different.  result: ' + result);
		else if (!(result.element instanceof Element)) {
			logger('codeToElement should return an object with an element property of type Element but got something else for code: ' + code + ', result.element = ' + result.element);
		}
	});
}

export function testCodeToElement(logger) {
	wrapAndCall([
		testWithVariousCodes
	], logger);
};