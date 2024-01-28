
/*
Determines if it is not safe to avoid wrapping the specified code in curved brackets

This is used to keep translated JavaScript code a little cleaner when it is safe to do so.
Though barely anyone looks at the JavaScript, removing unneeded curved brackets might help 
the parsing and execution speed of a JavaScript interpreter just a bit.
*/
function areBracketsImportantAroundCode(code) {
	try {
		const s = JSON.parse(code);
		const type = typeof s;
		if (type === 'string' || type === 'number' ||
		type === 'boolean' || s instanceof Array)
			return false;
	}
	catch (e) {
		// invalid JSON
	}
	return true;
}

export function wrapWithBracketsIfNeeded(code) {
	if (areBracketsImportantAroundCode(code))
		return `(${code})`;
	else
		return code;
};
