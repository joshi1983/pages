/*
This moves code changes to the syntax-highlighted elements without parsing or analyzing quality.
This doesn't always highlight the changes correctly but it must be extremely fast.

This is used while the user types code changes quickly.  
These changes get replaced with the completely parsed and analyzed results when the user stops typing quickly.
*/

function getIndexOfFirstDifferentCharacter(s1, s2) {
	const len = Math.min(s1.length, s2.length);
	for (let i = 0; i <= len; i++) {
		if (s1[i] !== s2[i])
			return i;
	}
}

function getLengthOfEqualEnding(s1, s2) {
	const len = Math.min(s1.length, s2.length);
	for (let i = 1; i < len; i++) {
		if (s1[s1.length - i] !== s2[s2.length - i])
			return i;
	}
	return len;
}

export function moveChangesToDOM(code, container) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string.  Not: ${code}`);
	if (!(container instanceof Element))
		throw new Error(`container must be an instance of Element.  Not: ${container}`);
	const oldCode = container.innerText;
	if (oldCode === code)
		return; // no change so nothing to do.
	const startIndex = getIndexOfFirstDifferentCharacter(oldCode, code);
	const endingLength = getLengthOfEqualEnding(oldCode, code);
	// FIXME: find out how much oldCode matches the beginning of code.
	// FIXME: find out how much  oldCode matches the end of code.
	container.innerText = code;
};