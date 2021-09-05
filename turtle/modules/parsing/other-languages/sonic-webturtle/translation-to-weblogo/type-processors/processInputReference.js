function getDigitsFrom(s) {
	return s.replace(/[^0-9]/g, '');
}

export function processInputReference(token, result, settings) {
	result.append(` "input${getDigitsFrom(token.val)} `);
};