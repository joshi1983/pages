function drawBackgroundGradient(ctx, w, h, t) {
	const cx = w / 2;
	const cy = h / 2;
	const r = Math.hypot(w / 2, h / 2);
	const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
	const animatedColor = `rgb(0, 0, ${Math.floor(t * 255)})`;
	gradient.addColorStop(0, animatedColor);
	gradient.addColorStop(0.9, "white");
	gradient.addColorStop(1, "green");
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, w, h);
}

function drawFrame(ctx, w, h, t) {
	drawBackgroundGradient(ctx, w, h, t);

	const cx = w / 2, cy = h / 2;
	const r = 40;
	const a = t * Math.PI * 2;
	const x = cx + r * Math.cos(a);
	const y = cy + r * Math.sin(a);
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.moveTo(cx, cy);
	ctx.lineTo(x, y);
	ctx.closePath();
	ctx.stroke();
}

function createAnimation() {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const w = 512;
	const h = 512;
	canvas.setAttribute('width', w);
	canvas.setAttribute('height', h);
	var encoder = new GIFEncoder();
	encoder.setSize(w, h);
	encoder.setRepeat(0);
	encoder.setDelay(10);
	encoder.start();
	for (let t = 0; t < 1; t += 0.001) {
		drawFrame(ctx, w, h, t);
		encoder.addFrame(ctx);
	}
	encoder.finish();
	encoder.download("download.gif");
}

function init() {
	createAnimation();
}

document.addEventListener('DOMContentLoaded', init);