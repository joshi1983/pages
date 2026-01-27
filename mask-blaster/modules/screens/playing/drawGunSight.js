export function drawGunSight(context2D, width, height) {
	const cx = width / 2, cy = height / 2;
	const oldOperation = context2D.globalCompositeOperation;
	context2D.lineWidth = 1;
	context2D.strokeStyle = 'rgba(0, 128, 255, 0.5)';
	context2D.globalCompositeOperation = 'lighter';
	context2D.beginPath();
	context2D.moveTo(0, cy);
	context2D.lineTo(width, cy);
	context2D.stroke();
	context2D.moveTo(cx, 0);
	context2D.lineTo(cx, height);
	context2D.closePath();
	context2D.stroke();
	context2D.globalCompositeOperation = oldOperation;
}