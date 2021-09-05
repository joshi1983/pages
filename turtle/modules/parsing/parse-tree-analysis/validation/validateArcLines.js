import { isNumber } from '../../../isNumber.js';

function getMessageFromInfo(info) {
	if (info.length === 0)
		return `A length of 0 will do nothing.  Consider either removing the call to arcLines or adding some data to it.`;
	for (let i = 0; i < info.length; i++) {
		const elementInfo = info[i];
		if (elementInfo.length < 1 || elementInfo.length > 2)
			return `The length of each element must be between 1 and 2 but but found a count of ${elementInfo.length} at item ${i + 1}`;
		else if (elementInfo.length === 2 && isNumber(elementInfo[1]) && elementInfo[1] < 0)
			return `The second element must be at least 0 but found a value of ${elementInfo[1]}. This problem was found in item ${i + 1}.`;
	}
}

function isOfInterest(cachedParseTree) {
	const tokenValues = cachedParseTree.getTokenValues();
	return function(token) {
		const childOfInterest = token.children[0];
		const infoVal = tokenValues.get(childOfInterest);
		if (infoVal instanceof Array) {
			const msg = getMessageFromInfo(infoVal);
			return msg !== undefined;
		}
	};
}

export function validateArcLines(cachedParseTree, parseLogger) {
	let callsOfInterest = cachedParseTree.getCommandCallsByName('arcLines').
		filter(isOfInterest(cachedParseTree));
	const tokenValues = cachedParseTree.getTokenValues();
	callsOfInterest.forEach(function(token) {
		const childOfInterest = token.children[0];
		const infoVal = tokenValues.get(childOfInterest);
		const msg = getMessageFromInfo(infoVal);
		if (infoVal.length === 0)
			parseLogger.warn(msg, childOfInterest, false);
		else
			parseLogger.error(msg, childOfInterest);
	});
};