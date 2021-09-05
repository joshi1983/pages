import { getRegularStarSecondRadius } from './getRegularStarSecondRadius.js';
import { roundIsoStar } from './roundIsoStar.js';

export function roundRegularStar(turtle, radius, numPoints, cornerRadius1, cornerRadius2) {
	if (radius === 0)
		return;
	const secondRadius = getRegularStarSecondRadius(radius, numPoints);
	roundIsoStar(turtle, radius, secondRadius, numPoints, cornerRadius1, cornerRadius2);
};