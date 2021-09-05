const urlExpression = /(http|https):\/\/[^ "/]+\.[^ "']+/g;

function compareByStartIndex(o1, o2) {
	return o1.startIndex - o2.startIndex;
}

function regexMatchToCleanObject(matchInfo) {
	return {
		's': matchInfo[0],
		'startIndex': matchInfo.index
	};
}

export function getURLMatches(s) {
	if (typeof s !== 'string')
		throw new Error('s must be a string');
	const results = Array.from(s.matchAll(urlExpression)).map(regexMatchToCleanObject);
	results.sort(compareByStartIndex);
	return results;
};