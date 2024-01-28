export function drawPointCloud(canvas, perspectiveTransformer, points, backgroundColour) {
	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;
	const dotScale = 3 * (width + height) / 2;
	ctx.fillStyle = backgroundColour.toString();
	ctx.fillRect(0, 0, width, height);
	const fullCircle = 2 * Math.PI;
	for (let i = 0; i < points.length; i++) {
		const cp = points[i];
		const p = perspectiveTransformer.transform(cp.vector);
		if (p === undefined)
			continue;

		const radius = dotScale * perspectiveTransformer.getZScale(cp.vector);
		ctx.fillStyle = cp.colour.to6DigitHTMLCode();
		ctx.beginPath();
		ctx.arc(p.getX(), p.getY(), radius, 0, fullCircle);
		ctx.closePath();
		ctx.fill();
	}
};