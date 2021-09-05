import { makeUnusualComments } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/scanning/makeUnusualComments.js';
import { processScanTokenProcessCases } from
'./processScanTokenProcessCases.js';

/*
Comments starting with repeated / or = aren't
part of the Logo3D language but treating them as comments can
help with code pasted from Steve Slater's example list which separated
example programs with ===== and /////.

Such repeated character tokens also would lead to syntax errors in Logo3D,
if they weren't treated as single line comments.

For the above reasons, makeUnusualComments exists to translate such tokens to WebLogo's single-line comment tokens.
*/
export function testMakeUnusualComments(logger) {
	const cases = [
		{'code': '/', 'tokens': ['/']},
		{'code': '=', 'tokens': ['=']},
		{'code': '////', 'tokens': [';////']},
		{'code': '//// comment', 'tokens': [';//// comment']},
		{'code': '////\npd', 'tokens': [';////', '\n', 'pd']},
		{'code': '===', 'tokens': [';===']},
		{'code': '=== comment', 'tokens': [';=== comment']},
		{'code': '===\npd', 'tokens': [';===', '\n', 'pd']},
		{'code': '\n===', 'tokens': ['\n', ';===']},
		{'code': ';hi\n===', 'tokens': [';hi', '\n', ';===']},
	];
	processScanTokenProcessCases(cases, makeUnusualComments, logger);
};