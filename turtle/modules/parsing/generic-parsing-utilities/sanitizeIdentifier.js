function isInvalidIdentifierChar(ch) {
	// digits are ok.
	if (/\d/.test(ch))
		return false;
	// letters are ok.
	if (/[a-z]/i.test(ch))
		return false;
	// a question mark can be ok at the end.
	if ('_?.'.indexOf(ch) !== -1)
		return false;
	return true;
}

function removeEveryQuestionMarkExceptAtEnd(s) {
	let result = s.replaceAll('?', '');
	if (s.endsWith('?'))
		return result + '?';
	else
		return result;
}

function removeFirstInvalidCharacters(s) {
	let i = 0;
	for (; i < s.length; i++) {
		const ch = s[i];
		// digits are invalid at start.
		if (ch >= '0' && ch <= '9')
			continue;
		// . shouldn't be at the beginning.
		if ('.'.indexOf(ch) !== -1)
			continue;
		if (isInvalidIdentifierChar(ch))
			continue;
		break;
	}
	return s.substring(i);
}

/*
Returns a sanitized version of the specified identifier.
The return value is always a valid WebLogo identifier.
*/
export function sanitizeIdentifier(s) {
	s = removeFirstInvalidCharacters(s);
	let result = '';
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (!isInvalidIdentifierChar(ch)) {
			result += ch;
		}
	}
	result = removeEveryQuestionMarkExceptAtEnd(result);
	if (result === '?')
		return 'v?';
	if (result === '')
		return 'v';
	return result;
};