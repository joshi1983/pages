import { isArcLinesDrawingAnything } from './arc-lines/isArcLinesDrawingAnything.js';
import { isOfInterest } from './validateDrawArcLineShape.js';
import { isNumber } from '../../../isNumber.js';
import { validateArcLinesInfo } from './arc-lines/validateArcLinesInfo.js';

export function validateDrawArcLineShapes(cachedParseTree, parseLogger) {
	const callsOfInterest = cachedParseTree.getCommandCallsByName('drawArcLineShapes').
		filter(isOfInterest(cachedParseTree));
	if (callsOfInterest.length === 0)
		return;
	const tokenValues = cachedParseTree.getTokenValues();
	callsOfInterest.forEach(function(token) {
		const firstChild = token.children[0];
		const shapesInfo = tokenValues.get(firstChild);
		if (shapesInfo !== undefined) {
			if (!(shapesInfo instanceof Array))
				parseLogger.error(`Shapes data must be a list.  Learn more by clicking <span class="command">drawArcLineShapes</span>.`, token, true);
			else if (shapesInfo.length === 0)
				parseLogger.warn(`Call to ${token.val} will have no effect because the shapes list is empty.`, token);
			else {
				shapesInfo.forEach(function(shapeInfo, index) {
					if (!(shapeInfo instanceof Array))
						parseLogger.error(`Shape data must be a list but found something else at item index ${index + 1}.  Learn more by clicking <span class="command">drawArcLineShapes</span>.`, token, true);
					else if (shapeInfo.length !== 3)
						parseLogger.error(`Shape data must have count 3 but found ${shapeInfo.length} at item index ${index + 1}.  Learn more by clicking <span class="command">drawArcLineShapes</span>.`, token, true);
					else {
						['First', 'Second'].forEach(function(prefix, shapeInfoIndex) {
							if (!isNumber(shapeInfo[shapeInfoIndex]))
								parseLogger.error(`${prefix} element of shape information sublist must be a number but found something else at sublist item ${index + 1}`, token);
						});
						const arcLinesInfo = shapeInfo[2];
						if (!(arcLinesInfo instanceof Array))
							parseLogger.error(`Arclines data found at item index ${index + 1} must be a list.  drawArcLineShapes will fail with an error if any of its shapes don't contain a list representing a path.  Learn more by clicking <span class="command">drawArcLineShapes</span>.`, token, true);
						else if (arcLinesInfo.length === 0)
							parseLogger.error(`Empty arclines data found at item index ${index + 1}.  drawArcLineShapes will fail with an error if any of its shapes don't contain a path.  Learn more by clicking <span class="command">drawArcLineShapes</span>.`, token, true);
						else if (!isArcLinesDrawingAnything(arcLinesInfo))
							parseLogger.error(`The arclines data found at item index ${index + 1} must draw at least 1 line or arc but it doesn't.  Learn more by clicking <span class="command">drawArcLineShapes</span> or <span class="command">arcLines</span>.`, token, true);
						else {
							const msg = validateArcLinesInfo(arcLinesInfo);
							if (msg !== undefined)
								parseLogger.error(`The arclines data found at item index ${index + 1} is invalid.  ${msg}  Learn more by clicking <span class="command">drawArcLineShapes</span> or <span class="command">arcLines</span>.`, token, true);
						}
					}
				});
			}
		}
	});
};