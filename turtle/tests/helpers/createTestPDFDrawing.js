import { Colour } from '../../modules/Colour.js';
import { LineSegmentShape } from '../../modules/drawing/vector/shapes/LineSegmentShape.js';
import { PathShape } from '../../modules/drawing/vector/shapes/PathShape.js';
import { PostScriptDrawer } from '../../modules/drawing/drawers/PostScriptDrawer.js';
import { Transparent } from '../../modules/Transparent.js';
import { Turtle } from '../../modules/command-groups/Turtle.js';
import { Vector2DDrawing } from '../../modules/drawing/vector/Vector2DDrawing.js';

export function createTestPDFDrawing() {
	const settings = {'animationTime': 0};
	const result = new Vector2DDrawing();
	const turtle = new Turtle(settings, result);
	turtle.forward(1);
	turtle.setPenColor(new Colour('#f00'));
	turtle.right(45);
	turtle.setPenSize(0.5);
	turtle.forward(1);
	turtle.penUp();
	turtle.setXY(1, 0);
	turtle.penDown();
	turtle.forward(0.4);
	turtle.right(20);
	turtle.setFillColor(new Colour('#f00'));
	turtle.polyStart();
	for (let i = 0; i < 4; i++) {
		turtle.forward(1);
		turtle.right(90);
	}
	turtle.polyEnd();

	turtle.forward(2);
	turtle.circle(2);
	turtle.forward(2);
	turtle.setFillColor(Transparent);
	turtle.setHeading(90);
	turtle.ellipse(4.5, 3);
	turtle.setFontFamily('Arial');
	turtle.setFillColor(new Colour("black"));
	turtle.label("Hello World");

	return result;
};