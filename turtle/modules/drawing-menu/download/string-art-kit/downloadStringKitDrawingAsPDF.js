import { Camera } from '../../../drawing/vector/Camera.js';
import { getFilename } from '../getFilename.js';
import { pdfDownload } from '../pdf/pdfDownload.js';
import { VectorDrawing } from '../../../drawing/vector/VectorDrawing.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

export function downloadStringKitDrawingAsPDF(drawing) {
	const boundingBox = drawing.getBoundingBox();
	const boxHeight = boundingBox.max.getY() - boundingBox.min.getY();
	const boxWidth = boundingBox.max.getX() - boundingBox.min.getX();
	const width = 8.5;
	const height = 11;
	let scale;
	if (width * boxHeight / boxWidth > height)
		scale = height / boxHeight;
	else
		scale = width / boxWidth;
	scale *= 0.9 // add some margins so there would be no problem printing.
	const scaledDrawing = new VectorDrawing();
	const camera = new Camera();
	camera.setZoomScale(scale);
	camera.position.assign(new Vector3D(-boundingBox.getAverageX(), -boundingBox.getAverageY(), 0));
	scaledDrawing.addForegroundShapes(drawing.getShapesArray().map(shape => shape.transformBy(camera)), false);
	pdfDownload(scaledDrawing, width, height, getFilename('application/pdf'));
};