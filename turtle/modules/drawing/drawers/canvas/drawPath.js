import { Vector } from '../../vector/Vector.js';

export function drawPath(canvasDrawer, path, ctx) {
	if (ctx === undefined)
		ctx = canvasDrawer.foreground;
	canvasDrawer.setShapeStyle(path.style, ctx);
	let translatedPos;
	ctx.beginPath();
	for (let i = 0; i < path.elements.length; i++) {
		const pathElement = path.elements[i];
		if (pathElement instanceof Vector) {
			translatedPos = canvasDrawer.getTranslatedPosition(pathElement);
			if (i === 0)
				ctx.moveTo(translatedPos.getX(), translatedPos.getY());
			else if ((i === path.elements.length - 1) || (path.elements[i + 1] instanceof Vector) ||
			(path.elements[i - 1] instanceof Vector))
				ctx.lineTo(translatedPos.getX(), translatedPos.getY());
		}
		else {
			const arc = pathElement;
			translatedPos = canvasDrawer.getTranslatedPosition(arc.position);
			if (i === 0) {
				const startPoint = canvasDrawer.getTranslatedPosition(arc.getStartPoint());
				ctx.moveTo(startPoint.getX(), startPoint.getY());
			}
			ctx.arc(translatedPos.getX(), translatedPos.getY(), arc.radius,
				Math.PI * 0.5 + arc.rotationRadians,
				Math.PI * 0.5 + arc.angle + arc.rotationRadians,
				arc.angle < 0
			);
		}
	}
	if (path.isClosed)
		ctx.closePath();
	if (path.style.usesFill())
		ctx.fill();
	if (path.style.isPenVisible())
		ctx.stroke();
	if (!path.isClosed)
		ctx.closePath();
};