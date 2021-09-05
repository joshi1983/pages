import { Colour } from '../../modules/Colour.js';
import { LineSegmentShape } from '../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../modules/drawing/vector/shapes/PathShape.js';
import { PostScriptDrawer } from '../../modules/drawing/drawers/PostScriptDrawer.js';
import { Turtle } from '../../modules/command-groups/Turtle.js';
import { Vector2DDrawing } from '../../modules/drawing/vector/Vector2DDrawing.js';

export function createTestPostScriptDrawing() {
	const settings = {'animationTime': 0};
	const result = new Vector2DDrawing();
	const turtle = new Turtle(settings, result);
	turtle.forward(10);
	turtle.setPenColor(new Colour('#f00'));
	turtle.right(45);
	turtle.setPenSize(5);
	turtle.forward(10);
	turtle.penUp();
	turtle.setXY(10, 0);
	turtle.penDown();
	turtle.forward(4);
	turtle.right(20);
	turtle.setLineJoinStyle("round");
	turtle.setFillColor(new Colour('#f00'));
	turtle.polyStart();
	for (let i = 0; i < 4; i++) {
		turtle.forward(100);
		turtle.right(90);
	}
	turtle.polyEnd();

	turtle.forward(100);
	turtle.circle(10);
	turtle.forward(10);
	turtle.setLineJoinStyle("bevel");
	turtle.arc(45, 30);

	return result;
};