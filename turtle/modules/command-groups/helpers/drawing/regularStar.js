import { getRegularStarSecondRadius } from './getRegularStarSecondRadius.js';
import { isotoxalStar } from './isotoxalStar.js';

/*
similar to the following WebLogo code:

to myRegularStar :radius :numPoints
	localmake "angle1 90 / :numPoints
	localmake "angle2 :angle1 * 2
	localmake "angle3 :angle2 * 2
	localmake "separation1 :radius * 2 * sin :angle1
	localmake "separation2 :radius * 2 * sin :angle2
	localmake "size1 sqrt :separation1 * :separation1 - :separation2 * :separation2 / 4
	localmake "size2 :separation2 / 2 * tan :angle3 - :angle2
	isotoxalStar :radius :radius - :size1 - :size2 :numPoints
end
*/
export function regularStar(turtle, radius, numPoints) {
	if (radius === 0)
		return;
	const secondRadius = getRegularStarSecondRadius(radius, numPoints);
	isotoxalStar(turtle, radius, secondRadius, numPoints);
};