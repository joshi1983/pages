import { AlphaColour } from '../../modules/AlphaColour.js';
import { Colour } from '../../modules/Colour.js';
import { GradientCommands } from '../../modules/command-groups/GradientCommands.js';
import { Transparent } from '../../modules/Transparent.js';
import { Turtle } from '../../modules/command-groups/Turtle.js';
import { VectorDrawing } from '../../modules/drawing/vector/VectorDrawing.js';

export function createTestDrawing() {
	const settings = {'animationTime': 0};
	const result = new VectorDrawing();
	const turtle = new Turtle(settings, result);
	const gradients = new GradientCommands();
	result.setScreenColor(Transparent);
	result.setScreenColor(new Colour('#888'));
	turtle.forward(10);
	turtle.circle(15);
	turtle.setPenColor(new AlphaColour('#8f00'));
	turtle.circle(20);
	result.setDimensions(300, 300);
	turtle.right(45);
	turtle.forward(5);
	turtle.setPenSize(5);
	turtle.circle(25);
	turtle.ellipse(10, 20);
	turtle.setXY(10, 0);
	turtle.forward(4);
	turtle.right(20);
	turtle.ellipse(10, 5);
	turtle.ellipseArc(45, 100, 200, 10);
	turtle.arc(45, 100);
	turtle.label("Hello World");
	turtle.setFillColor(new Colour('#f00'));
	turtle.sphere(10);
	turtle.setLineJoinStyle("round");

	turtle.polyStart();
	for (let i = 0; i < 4; i++) {
		turtle.forward(100);
		turtle.right(90);
	}
	turtle.polyEnd();

	const colorStops = new Map([
		[0, "black"],
		[1, "blue"]
	]);
	turtle.setLineJoinStyle("bevel");
	const gradient1 = gradients.createLinearGradient([50, 50], [100, 100], colorStops, "pad");
	turtle.setFillGradient(gradient1);
	turtle.circle(100);

	const gradient2 = gradients.createRadialGradient2([60, 60], [70, 60], 50, colorStops, "pad");
	turtle.setFillGradient(gradient2);
	turtle.setXY(50, 50);
	turtle.circle(100);
	turtle.setFillColor(Transparent);
	turtle.setPenGradient(gradient1);
	turtle.circle(50);

	turtle.jumpForward(100);
	turtle.square(10);

	return result;
};