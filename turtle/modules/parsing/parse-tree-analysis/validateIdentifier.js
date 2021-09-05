const identifierPattern = /^[a-z\_\u0370-\u03FF\u0600-\u06FF\u4E00-\u9FFF\u00C0-\u017F][\w\.\u0370-\u03FF\u0600-\u06FF\u4E00-\u9FFF\u00C0-\u017F]*[\?]?$/mi;

// not using a regular expression to avoid "too much recursion" errors that
// sometimes happen when resources are low in the web browser.
function isDigit(ch) {
	return ch >= '0' && ch <= '9';
}

/*
Validates identifiers for use in WebLogo variable names, procedure names...
*/
export function validateIdentifier(name) {
	if (name === '')
		return 'must be at least 1 character';
	if (isDigit(name.charAt(0)))
		return 'must not start with a digit';
	if (name.charAt(0) === '.')
		return 'must not start with a period but a period can be used later';
	const indexOfQuestionMark = name.indexOf('?');
	if (indexOfQuestionMark >= 0 && indexOfQuestionMark !== name.length - 1)
		return 'must have its ? at the end and nowhere else';

	// start with a letter or underscore.
	// contain no whitespaces.
	if (!identifierPattern.test(name))
		return 'must contain nothing but underscores, periods, digits, and alphabet(English, Greek, Arabic, Chinese...) letters.  A ?(question mark) can be added but only at the end';
};
