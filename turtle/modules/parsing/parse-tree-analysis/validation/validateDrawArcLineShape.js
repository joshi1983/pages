import { Command } from '../../Command.js';
import { isArcLinesDrawingAnything } from './arc-lines/isArcLinesDrawingAnything.js';
import { isNumber } from '../../../isNumber.js';
import { validateArcLinesInfo } from './arc-lines/validateArcLinesInfo.js';
await Command.asyncInit();

export function isOfInterest(cachedParseTree) {
	const tokenValues = cachedParseTree.getTokenValues();
	return function(token) {
		if (token.children.length !== 2)
			return false;
		const firstChild = token.children[0];
		const shapesInfo = tokenValues.get(firstChild);
		if (!(shapesInfo instanceof Array)) {
			return false;
		}
		return true;
	};
};

export function validateDrawArcLineShape(cachedParseTree, parseLogger) {
	const callsOfInterest = cachedParseTree.getCommandCallsByName('drawArcLineShape').
		filter(isOfInterest(cachedParseTree));
	if (callsOfInterest.length === 0)
		return;
	const tokenValues = cachedParseTree.getTokenValues();
	callsOfInterest.forEach(function(token) {
		const firstChild = token.children[0];
		const shapeInfo = tokenValues.get(firstChild);
		if (shapeInfo !== undefined) {
			if (shapeInfo.length !== 3)
				parseLogger.error(`Shape data must have count 3 but found ${shapeInfo.length}.  Learn more by clicking <span class="command">drawArcLineShape</span>.`, token, true);
			else {
				['First', 'Second'].forEach(function(prefix, shapeInfoIndex) {
					if (!isNumber(shapeInfo[shapeInfoIndex]))
						parseLogger.error(`${prefix} element of shape information must be a number but found something else`, token);
				});
				const arcLinesInfo = shapeInfo[2];
				if (arcLinesInfo.length === 0)
					parseLogger.error(`Empty arclines data.  drawArcLineShape will fail with an error if any of its shapes don't contain a path.  Learn more by clicking <span class="command">drawArcLineShape</span>.`, token, true);
				else if (!isArcLinesDrawingAnything(arcLinesInfo))
					parseLogger.error(`The arclines data must draw at least 1 line or arc but it doesn't.  Learn more by clicking <span class="command">drawArcLineShape</span> or <span class="command">arcLines</span>.`, token, true);
				else {
					const msg = validateArcLinesInfo(arcLinesInfo);
					if (msg !== undefined)
						parseLogger.error(`The arclines data is invalid.  ${msg}  Learn more by clicking <span class="command">drawArcLineShape</span> or <span class="command">arcLines</span>.`, token, true);
				}
			}
		}
	});
};