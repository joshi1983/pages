const invalidLinePrefixes = ['>>>', '...'];
/*
These are prefixes that are ALWAYS problems in Python code at the start of any line of code.
In other words, there is no way to write valid Python code with a line starting with one of these line prefixes.

Long strings can span multiple lines and start with these prefixes but
sanitization quits on any line and every line after the start of one.
This way, a long string containing a line that starts with >>> will never have its >>> erroneously removed.
*/

function ltrimIndentation(line) {
	if (line.trim() === '')
		return '';
	if (line.length <= 1 || line[0] !== ' ')
		return line;
	if (/\s/g.test(line[1]))
		return line;
	return line.substring(1); // remove the single regular space at beginning of the line.
}

/*
This could help if a user pasted code from something like:
https://realpython.com/beginners-guide-python-turtle/#drawing-a-shape

The >>> is the Python prompt but we can help make
the Python code more translatable by removing it.
That's more user-friendly and easier to implement than
trying to train the user about Python and preventing them from getting it in WebLogo format.
*/
function removeErroneousLinePrefixes(code) {
	const lines = code.split('\n');
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		if (line.indexOf('"""') !== -1 || line.indexOf('\'\'\'') !== -1)
			break;
		invalidLinePrefixes.forEach(function(prefix) {
			while (line.startsWith(prefix))
				line = line.substring(prefix.length);
		});
		lines[i] = ltrimIndentation(line);
	}
	return lines.join('\n');
}

function trim(code) {
	return code.trim();
}

const sanitizers = [
	removeErroneousLinePrefixes,
	trim,
];

export function sanitizePythonCode(code) {
	sanitizers.forEach(function(sanitize) {
		code = sanitize(code);
	});
	return code;
};