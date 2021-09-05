import { Colour } from '../../../../modules/Colour.js';
import { Turtle } from '../../../../modules/command-groups/Turtle.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';
import { Vector2DDrawing } from '../../../../modules/drawing/vector/Vector2DDrawing.js';

export function createTestDrawingForStringArt() {
	const settings = {'animationTime': 0};
	const result = new Vector2DDrawing();
	const turtle = new Turtle(settings, result);
	result.setScreenColor(new Colour('#888'));
	turtle.forward(10);
	turtle.setPenColor(new Colour('#f00'));
	result.setDimensions(300, 300);
	turtle.right(45);
	turtle.forward(5);
	turtle.setPenSize(5);
	turtle.setXY(10, 0);
	turtle.forward(4);
	turtle.right(20);
	return result;
};