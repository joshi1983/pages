function compareByStartIndex(o1, o2) {
	return o1.startIndex - o2.startIndex;
}

function regexMatchToCleanObject(matchInfo) {
	return {
		's': matchInfo[0],
		'startIndex': matchInfo.index
	};
}

/*
Closing curved brackets ) are valid in URL's according to an answer at:
https://stackoverflow.com/questions/13225028/is-it-ok-to-have-brackets-or-parenthesis-in-url

A curved bracket is very rarely in a URL, though.
If a ( immediately precedes the URL, it is most-likely that the ) should be excluded.
This function removes the closing curved brackets in such cases.
*/
function sanitizeSurroundingCurvedBrackets(s, results) {
	for (let i = 0; i < results.length; i++) {
		const m = results[i];
		if (m.startIndex > 0 && m.s.indexOf(')') !== -1 && s.charAt(m.startIndex - 1) === '(') {
			const index = m.s.indexOf(')');
			m.s = m.s.substring(0, index);
		}
	}
}

function handleSpecialQuotedLinkCases(s, results) {
	const urlExpression = /(http|https):\/\/[^ "/]+\.[^ \n"\]]+/;
	for (const match of results) {
		if (match.startIndex > 0) {
			const prefixChar = s[match.startIndex - 1];
			const quoteIndex = match.s.indexOf("'");
			if (prefixChar === "'" && quoteIndex !== -1) {
				const s = match.s.substring(0, quoteIndex);
				if (urlExpression.test(s))
					match.s = s;
			}
		}
	}
}

export function getURLMatches(s) {
	if (typeof s !== 'string')
		throw new Error('s must be a string');
	const urlExpression = /(http|https):\/\/[^ "/]+\.[^ \n"\]]+/g;
	const results = Array.from(s.matchAll(urlExpression)).map(regexMatchToCleanObject);
	handleSpecialQuotedLinkCases(s, results);
	sanitizeSurroundingCurvedBrackets(s, results);
	results.sort(compareByStartIndex);
	return results;
};