export function drawBackgroundGrid(context2D, width, height, viewpoint) {
	const scale = width;
	const startOffset = 1;
	const numCircles = 30;

	context2D.strokeStyle = '#888';
	for (let i = 0; i < numCircles; i++) {
		const z = (i + startOffset);
		const radius = 2 * scale / z;
		const cx = width / 2 + scale * viewpoint.x / z;
		const cy = height / 2 + scale * viewpoint.y / z;
		context2D.lineWidth = scale * 0.01 / z;
		context2D.beginPath();
		context2D.arc(cx, cy, radius, 0, Math.PI * 2);
		context2D.closePath();
		context2D.stroke();
	}
};