const invalidLinePrefixes = ['>>>', '...'];

/*
This could help if a user pasted code from something like:
https://realpython.com/beginners-guide-python-turtle/#drawing-a-shape

The >>> is the Python prompt but we can help make
the Python code more translatable by removing it.
That's more user-friendly and easier to implement than
trying to train the user about Python and preventing them from getting it in WebLogo format.
*/
export function removeErroneousLinePrefixes(code) {
	const lines = code.split('\n');
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		if (line.indexOf('"""') !== -1 || line.indexOf('\'\'\'') !== -1)
			break;
		invalidLinePrefixes.forEach(function(prefix) {
			while (line.startsWith(prefix))
				line = line.substring(prefix.length);
		});
		lines[i] = line;
	}
	return lines.join('\n');
};