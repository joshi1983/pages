export function fillPolygon(canvas) {
	const ctx = canvas.getContext("2d");
	// create a new detached canvas the same size as the visible one,
	// this allows to not affect the previous drawings on the visible canvas
	const off = canvas.cloneNode();
	const oCtx = off.getContext("2d");
	//oCtx.lineWidth = 40;
	//oCtx.rect(20, 20, 100, 100);
	//oCtx.fill();
	ctx.fillStyle = 'orange';
	ctx.beginPath();
	ctx.arc(100, 75, 50, 0, 2 * Math.PI);
	ctx.fill();
	
	// next drawing will "stay" only where already painted
	oCtx.globalCompositeOperation = "source-in";
	// note: we set the 'fillStyle' to 'g', not the 'strokeStyle'
	var g = oCtx.fillStyle = oCtx.createRadialGradient(70, 70, 0, 70, 70, 100);
	g.addColorStop(0.4, "blue");
	g.addColorStop(0.7, "red");

	oCtx.translate(70, 70);
	oCtx.scale(0.5, 1);
	oCtx.translate(-70, -70);
	// in order for our fillRect call to cover the whole canvas
	// even when the context is transformed, we need to transform
	// our points through the inverse CTM
	const invertMat = oCtx.getTransform().invertSelf();
	const transformedXY = invertMat.transformPoint({ x: 0, y: 0 });
	const transformedWH = invertMat.transformPoint({ x: off.width, y: off.height });
	oCtx.fillRect(transformedXY.x, transformedXY.y, transformedWH.x, transformedWH.y);
	// Draw back to the visible canvas
	ctx.drawImage(off, 0, 0);
};