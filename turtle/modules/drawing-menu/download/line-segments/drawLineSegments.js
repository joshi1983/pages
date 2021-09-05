export function drawLineSegments(canvas, perspectiveTransformer, lineSegments, backgroundColour) {
	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;
	ctx.fillStyle = backgroundColour.toString();
	ctx.fillRect(0, 0, width, height);
	const fullCircle = 2 * Math.PI;
	for (let i = 0; i < lineSegments.length; i++) {
		const line = lineSegments[i];
		const cline = line.transformWith(perspectiveTransformer);
		if (cline === undefined)
			continue;

		ctx.strokeStyle = cline.colour.to6DigitHTMLCode();
		ctx.beginPath();
		ctx.moveTo(cline.point1.getX(), cline.point1.getY());
		ctx.lineTo(cline.point2.getX(), cline.point2.getY());
		ctx.closePath();
		ctx.stroke();
	}
};