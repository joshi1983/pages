/*
Similar to the following WebLogo code:
to myRegularPolygon :radius :numSides
	assert :numSides >= 2
	localmake "oldState turtleState
	localmake "len :radius * 2 * sin 180 / :numSides
	jumpForward :radius
	right 90 + 180 / :numSides
	polyStart
	repeat :numSides [
		jumpForward :len
		right 360 / :numSides
	]
	polyEnd
	setTurtleState :oldState
end
*/
export function regularPolygon(turtle, radius, numSides) {
	// We're not using turtle.turtleState() just for the tiny performance benefit.
	// turtleState and setTurtleState reads and sets a lot of properties we don't need to touch here.
	// This optimization is worth it in JavaScript which WebLogo users won't see but not worth it in 
	// WebLogo examples.
	const oldHeading = turtle.heading();
	const oldPos = turtle.pos();
	if (numSides < 2)
		throw new Error(`The regularPolygon command requires numSides to be at least 2 but you specified ${numSides}`);
	const angleStep = 360 / numSides;
	const len = radius * 2 * Math.sin(Math.PI / numSides);
	turtle.jumpForward(radius);
	turtle.right(90 + angleStep / 2);
	turtle.polyStart();
	numSides--; // can rely on the polygon closing for the very last side
	for (let i = 0; i < numSides; i++) {
		turtle.jumpForward(len);
		turtle.right(angleStep);
	}
	turtle.polyEnd();

	turtle.jumpTo(oldPos);
	turtle.setHeading(oldHeading);
};