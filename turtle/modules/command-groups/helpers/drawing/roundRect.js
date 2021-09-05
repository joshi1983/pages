import { rect } from './rect.js';

/*
Similar to this WebLogo implementation:
to roundRect :width :height :cornerRadius
	ifelse :cornerRadius <= 0 [
		rect :width :height
	] [
		localmake "oldState turtleState
		localmake "innerWidth :width - :cornerRadius * 2
		localmake "innerHeight :height - :cornerRadius * 2
		jumpBackward :height / 2
		jumpRight :innerWidth / 2
		right 90
		polyStart
		repeat 2 [
			arcLeft 90 :cornerRadius
			jumpForward :innerHeight
			arcLeft 90 :cornerRadius
			jumpForward :innerWidth
		]
		polyEnd
		setTurtleState :oldState
	]
end
*/
export function roundRect(turtle, width, height, cornerRadius) {
	if (cornerRadius <= 0)
		rect(turtle, width, height);
	else {
		const oldPos = turtle.pos();
		const oldHeading = turtle.heading();
		const innerWidth = width - cornerRadius * 2;
		const innerHeight = height - cornerRadius * 2;
		turtle.jumpBackward(height / 2);
		turtle.jumpRight(innerWidth / 2);
		turtle.right(90);
		turtle.polyStart();
		for (let i = 0; i < 2; i++) {
			turtle.arcLeft(90, cornerRadius);
			turtle.jumpForward(innerHeight);
			turtle.arcLeft(90, cornerRadius);
			turtle.jumpForward(innerWidth);
		}
		turtle.polyEnd();
		turtle.jumpTo(oldPos);
		turtle.setHeading(oldHeading);
	}
};