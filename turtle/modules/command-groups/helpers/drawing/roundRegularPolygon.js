import { regularPolygon } from './regularPolygon.js';

/*
This is similar to:
to roundRegularPolygon :radius :numSides :cornerRadius
	localmake "oldState turtleState
	localmake "angleStep 360 / :numSides
	localmake "cornerSize1 :cornerRadius * tan :angleStep / 2
	localmake "straightLength :radius * 2 * sin :angleStep / 2
	localmake "size1 :straightLength - :cornerSize1 * 2
	if :size1 &lt;= 0 [
		; If there are no straight edges,
		; draw 1 circle instead of the more complex shape.
		; This is a bit faster.
		circle :radius
		stop
	]
	penUp
	jumpForward :radius
	left 90 + 180 / :numSides
	jumpForward :cornerSize1
	right 180
	polyStart
	repeat :numSides [
		arcRight :angleStep :cornerRadius
		jumpForward :size1
	]
	polyEnd
	setTurtleState :oldState
end
*/
export function roundRegularPolygon(turtle, radius, numSides, cornerRadius) {
	if (cornerRadius === 0) {
		regularPolygon(turtle, radius, numSides);
	}
	else {
		const angleStepDegrees = 360 / numSides;
		const cornerSize1 = cornerRadius * Math.tan(angleStepDegrees / 2 * Math.PI / 180);
		const straightLength = radius * 2 * Math.sin(angleStepDegrees / 2 * Math.PI / 180);
		const size1 = straightLength - cornerSize1 * 2;
		if (size1 <= 0) {
			/* If there are no straight edges,
			draw 1 circle instead of the more complex shape.
			This is a bit faster. */
			turtle.circle(radius);
		}
		else {
			const oldHeading = turtle.heading();
			const oldPos = turtle.pos();
			turtle.jumpForward(radius);
			turtle.left(90 + 180 / numSides);
			turtle.jumpForward(cornerSize1);
			turtle.right(180);
			turtle.polyStart();
			for (let i = 0; i < numSides; i++) {
				turtle.arcRight(angleStepDegrees, cornerRadius);
				turtle.jumpForward(size1);
			}
			turtle.polyEnd();
			turtle.jumpTo(oldPos);
			turtle.setHeading(oldHeading);
		}
	}
};