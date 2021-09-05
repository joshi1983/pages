import { Vector } from '../../vector/Vector.js';

export function drawPath(canvasDrawer, path, ctx) {
	if (ctx === undefined)
		ctx = canvasDrawer.foreground;
	const elements = path.elements;
	canvasDrawer.setShapeStyle(path, ctx);
	let translatedPos;
	ctx.beginPath();
	for (let i = 0; i < elements.length; i++) {
		const pathElement = elements[i];
		if (pathElement instanceof Vector) {
			translatedPos = canvasDrawer.getTranslatedPosition(pathElement);
			if (i === 0)
				ctx.moveTo(translatedPos.getX(), translatedPos.getY());
			else
				ctx.lineTo(translatedPos.getX(), translatedPos.getY());
		}
		else {
			const arc = pathElement;
			translatedPos = canvasDrawer.getTranslatedPosition(arc.position);
			ctx.arc(translatedPos.getX(), translatedPos.getY(), arc.radius,
				Math.PI * 0.5 + arc.rotationRadians,
				Math.PI * 0.5 + arc.angle + arc.rotationRadians,
				arc.angle < 0
			);
		}
	}
	if (path.isClosed)
		ctx.closePath();
	if (path.style.isFillVisible())
		ctx.fill();
	if (path.style.isPenVisible())
		ctx.stroke();
	if (!path.isClosed)
		ctx.closePath();
};