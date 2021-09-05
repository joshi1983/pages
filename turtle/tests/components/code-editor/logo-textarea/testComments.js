import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Comments } from '../../../../modules/components/code-editor/logo-textarea/Comments.js';

function testAddCommentPrefixes(logger) {
	const cases = [
		{'in': '', 'out': ';'},
		{'in': ';hello', 'out': ';hello'}, // no change because a comment is already there.
		{'in': ' ;hello', 'out': ' ;hello'}, // no change.
		{'in': '\t;hello', 'out': '\t;hello'}, // no change.
		{'in': 'hello', 'out': ';hello'},
		{'in': ' hello', 'out': ' ;hello'},
		{'in': '   hello', 'out': '   ;hello'},
		{'in': '    hello', 'out': '    ;hello'},
		{'in': '     hello', 'out': '     ;hello'},
		{'in': '    \thello', 'out': '    \t;hello'},
		{'in': '\thello', 'out': '\t;hello'},
		{'in': '\t\thello', 'out': '\t\t;hello'},
		{'in': '\t hello', 'out': '\t ;hello'},
	];
	cases.forEach(function(caseInfo) {
		const result = Comments.addCommentPrefixes(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
}

function testRemoveCommentPrefixes(logger) {
	const cases = [
		{'in': '', 'out': ''}, // no change because there is no comment prefix
		{'in': 'hello', 'out': 'hello'},
		{'in': 'hello;', 'out': 'hello;'}, // the ; is at the end so it is not a "prefix".
		{'in': ' hello', 'out': ' hello'},
		{'in': '   hello\n\t\thi', 'out': '   hello\n\t\thi'},
		{'in': '   ;hello\n\t\thi', 'out': '   hello\n\t\thi'},
		{'in': ';hello', 'out': 'hello'}
	];
	cases.forEach(function(caseInfo) {
		const result = Comments.removeCommentPrefixes(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
}

export function testComments(logger) {
	testAddCommentPrefixes(prefixWrapper('testAddCommentPrefixes', logger));
	testRemoveCommentPrefixes(prefixWrapper('testRemoveCommentPrefixes', logger));
};