/*
shouldCommentLineBeRemoved decides if a given comment string for 1 line
should be removed when translating Python turtle code to WebLogo.

A WebLogo translation of a Python turtle script gets no value
from a comment indicating a path to a Python interpreter in Linux or Unix.

Some discussion about paths to Python interpreters is here:
https://stackoverflow.com/questions/2589711/find-full-path-of-the-python-interpreter
*/
const shellPathSnippets = [
'!/usr/bin/env',
'!/usr/bin/python',
'!/usr/include/python',
'!/usr/lib/python',
'!/usr/local/sbin'];

function isLikelyPythonInterpreterPath(s) {
	if (s.indexOf('python') === -1)
		return false;
	for (let i = 0; i < shellPathSnippets.length; i++) {
		const snippet = shellPathSnippets[i];
		const index = s.indexOf(snippet);
		if (index !== -1 && index < 5) {
			return true;
		}
	}
	return false;
}

export function shouldCommentLineBeRemoved(s) {
	if (isLikelyPythonInterpreterPath(s))
		return true;

	return false;
};