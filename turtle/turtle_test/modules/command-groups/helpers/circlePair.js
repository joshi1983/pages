/*
to zeroTolerantArcLeft :angle :arcRadius
	ifelse :arcRadius = 0 [
		left :angle
		; don't draw an arc because an arc can't exist with a radius of 0.
	] [
		arcLeft :angle :arcRadius
	]
end

to myCirclePair :startRadius :endRadius :separation
	if :separation < 0 [
		right 180
		myCirclePair :startRadius :endRadius -:separation
		right 180
		stop
	]
	localmake "maxRadius max :startRadius :endRadius
	ifelse :separation <= :maxRadius -
	(min :startRadius :endRadius) [
		circle :maxRadius
	] [
		localmake "oldPos pos
		localmake "oldHeading heading
		localmake "size1 :endRadius - :startRadius
		localmake "angle1 arcSin :size1 / :separation
		localmake "tangentLength :separation * cos :angle1
		left 90 + :angle1
		jumpForward :startRadius
		left 90
		polyStart
		zeroTolerantArcLeft 180 - :angle1 * 2 :startRadius
		forward :tangentLength
		zeroTolerantArcLeft 180 + :angle1 * 2 :endRadius
		polyEnd
		jumpTo :oldPos
		setHeading :oldHeading
		jumpForward :separation
	]
end
*/
export function circlePair(turtle, startRadius, endRadius, separation) {
	if (separation < 0) {
		turtle.right(180);
		circlePair(turtle, startRadius, endRadius, -separation);
		turtle.right(180);
		return;
	}
	const maxRadius = Math.max(startRadius, endRadius);
	if (separation <= maxRadius - Math.min(startRadius, endRadius)) {
		turtle.circle(maxRadius);
	}
	else {
		const oldPos = turtle.pos();
		const oldHeading = turtle.heading();
		const size1 = endRadius - startRadius;
		const angle1Radians = Math.asin(size1 / separation);
		const angle1Degrees = angle1Radians * 180 / Math.PI;
		const tangentLength = separation * Math.cos(angle1Radians);
		turtle.left(90 + angle1Degrees);
		turtle.jumpForward(startRadius);
		turtle.left(90);
		turtle.polyStart();
		let a = 180 - angle1Degrees * 2;
		if (startRadius === 0)
			turtle.left(a);
		else
			turtle.arcLeft(a, startRadius);
		turtle.jumpForward(tangentLength);
		a = 180 + angle1Degrees * 2;
		if (endRadius === 0)
			turtle.left(a);
		else
			turtle.arcLeft(a, endRadius);
		turtle.polyEnd();
		turtle.jumpTo(oldPos);
		turtle.setHeading(oldHeading);
		turtle.jumpForward(separation);
	}
};