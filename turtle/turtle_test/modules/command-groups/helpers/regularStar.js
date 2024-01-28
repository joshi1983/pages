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
	const angle1 = Math.PI / 2 / numPoints;
	const angle2 = angle1 * 2;
	const angle3 = angle2 * 2;
	const separation1 = radius * 2 * Math.sin(angle1);
	const separation2 = radius * Math.sin(angle2);
	const size1 = Math.sqrt(separation1 * separation1 - separation2 * separation2);
	const size2 = separation2 * Math.tan(angle3 - angle2);
	isotoxalStar(turtle, radius, radius - size1 - size2, numPoints);
};