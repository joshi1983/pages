import { isArcLinesDrawingAnything } from './arc-lines/isArcLinesDrawingAnything.js';
import { validateArcLinesInfo } from './arc-lines/validateArcLinesInfo.js';

function isOfInterest(cachedParseTree) {
	const tokenValues = cachedParseTree.getTokenValues();
	return function(token) {
		const childOfInterest = token.children[0];
		const infoVal = tokenValues.get(childOfInterest);
		if (infoVal instanceof Array) {
			if (!isArcLinesDrawingAnything(infoVal))
				return true;
			const msg = validateArcLinesInfo(infoVal);
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
		const msg = validateArcLinesInfo(infoVal);
		if (infoVal.length === 0)
			parseLogger.warn( `A length of 0 will do nothing.  Consider either removing the call to <span class="command">arcLines</span> or adding some data to it.`, childOfInterest, true);
		else if (!isArcLinesDrawingAnything(infoVal))
			parseLogger.warn( `Nothing will be drown based on the specified arc lines data.  Consider removing the call to <span class="command">arcLines</span> or changing its data to draw something.`, childOfInterest, true);
		else
			parseLogger.error(msg, childOfInterest);
	});
};