const scriptExampleKey = 'scriptExampleQuery';

export function wasScriptExampleUsed() {
	return localStorage.getItem(scriptExampleKey) !== null;
};

export function getScriptExampleQuery() {
	if (wasScriptExampleUsed())
		return localStorage.getItem(scriptExampleKey);
	else
		return '';
};

export function setScriptExampleQuery(s) {
	if (typeof s !== 'string')
		throw new Error('s must be a string');

	localStorage.setItem(scriptExampleKey, s);
};