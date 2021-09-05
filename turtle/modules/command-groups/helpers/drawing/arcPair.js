import { clamp } from '../../../clamp.js';
import { MathCommands } from '../../MathCommands.js';

const angleFactor = MathCommands.degToRadianScale / 2;

export function arcPair(turtle, length, arcAngle) {
	arcAngle = clamp(arcAngle, 0, 359.9);
	const angleRadians = arcAngle * angleFactor;
	const sinRatio = Math.sin(angleRadians);
	if (Math.abs(sinRatio) < 0.0001) {
		const oldPos = turtle.pos();
		turtle.forward(length);
		turtle.jumpTo(oldPos);
	}
	else {
		arcAngle = angleRadians * 2 / MathCommands.degToRadianScale;
		const arcRadius = Math.abs(length / 2 / sinRatio);
		turtle.left(arcAngle / 2);
		turtle.polyStart();
		turtle.arcRight(arcAngle, arcRadius);
		turtle.right(180 - arcAngle);
		turtle.arcRight(arcAngle, arcRadius);
		turtle.polyEnd();
		turtle.right(180 - arcAngle / 2);
	}
};