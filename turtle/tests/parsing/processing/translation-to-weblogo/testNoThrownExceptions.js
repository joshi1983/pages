import { translateProcessingToWebLogo } from
'../../../../modules/parsing/processing/translation-to-weblogo/translateProcessingToWebLogo.js';

/*
This tries translating some weird and invalid 
Processing code to test that
translateProcessingToWebLogo does not throw an exception 
no matter how weird the input code is.
*/
export function testNoThrownExceptions(logger) {
	const cases = [
		'','$','.',',', '!', '-', '+', '/', '~', 
		'`', '#', '%', '^', '&',
		'(', ')', '[', ']', '{', '}', '\\', '1',
		'.x', '!=',
		'<>', '~!@#$%^&*()_+-=,.><?:/', '?', ':', 'z:','x=',
		'true', 'false', 'x', 'تشكيل الحروف', '你好',
		'new', 'new [', 'new {', 'new (', 'a[', 'a[3][5][7][9][',
		'z.', 'z.= 4','z.3', 'z.3 =2', '3.g', '3.g=',
		'a[x.y.z[4]]', 'println', 'println.x', 'int.x',
		'int.float', 'x[3].y = 4'
	];
	cases.forEach(function(code, index) {
		try {
			translateProcessingToWebLogo(code);
		}
		catch (e) {
			logger(`Case ${index}, code=${code} translating failed with an exception thrown. e=${e}`);
		}
	});
};