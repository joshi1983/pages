import { clampRadianAngle } from '../../../clampRadianAngle.js';
import { Vector2D } from '../../../drawing/vector/Vector2D.js';

/*
We tried importing the Turtle module and using its arcLines method
but that lead to a JavaScript import error.

arcLines is pretty simple for now and we only need 2D so we can improve performance a bit byte
duplicating a little of its code.
*/
export function arcLinesInfo(arcLinesInfo_) {
	let headingRadians = 0;
	let pos = new Vector2D();
	for (const actionInfo of arcLinesInfo_) {
		if (actionInfo.length === 1) {
			pos = pos.getDisplacedByPolar(headingRadians, actionInfo[0]);
		}
		else if (actionInfo.length === 2) {
			const angleDegrees = actionInfo[0];
			const angleRadians = angleDegrees * Math.PI / 180;
			const radius = actionInfo[1];
			if (radius !== 0) {
				const chordLength = Math.abs(2 * radius * Math.sin(angleRadians / 2));
				pos = pos.getDisplacedByPolar(headingRadians - angleRadians / 2, chordLength);
			}
			headingRadians -= angleRadians;
		}
		else
			throw new Error(`Invalid action information passed to arcLinesInfo.`);
	}
	const posCoords = pos.coords;
	let headingDegrees = clampRadianAngle(headingRadians) * 180 / Math.PI;
	const towardsFinalRadians = clampRadianAngle(Math.atan2(posCoords[1], posCoords[0]));
	const towardsFinalDegrees = towardsFinalRadians * 180 / Math.PI;
	return [headingDegrees, Math.hypot(...posCoords), towardsFinalDegrees];
};
