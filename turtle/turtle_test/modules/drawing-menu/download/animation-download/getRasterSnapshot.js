import { Camera } from '../../../drawing/vector/Camera.js';
import { CanvasVector2DDrawer } from '../../../drawing/drawers/CanvasVector2DDrawer.js';
import { getSnapshotStyleFromProgram } from '../../../drawing/vector/animation/getSnapshotStyleFromProgram.js';
import { getDrawingSnapshot } from '../../../drawing/vector/animation/getDrawingSnapshot.js';

/*
asynchronously creates an image with the specified width, height and animation time by running the specified program.
*/
export async function getRasterSnapshot(program, width, height, animationTimeSeconds, animationDurationSeconds) {
	if (typeof animationTimeSeconds !== 'number')
		throw new Error('animationTimeSeconds must be a number.  Not: ' + animationTimeSeconds);
	if (typeof animationDurationSeconds !== 'number')
		throw new Error('animationDurationSeconds must be a number.  Not: ' + animationDurationSeconds);
	const snapshotStyle = await getSnapshotStyleFromProgram(program, animationTimeSeconds, animationDurationSeconds);
	const drawingUnitDimensions = snapshotStyle.getDimensionsForAspectRatio(width / height);
	const drawing = await getDrawingSnapshot(program, animationTimeSeconds, animationDurationSeconds);
	const canvas = document.createElement('canvas');
	const camera = new Camera();
	const drawer = new CanvasVector2DDrawer(undefined, width, height);
	camera.setZoomScale(width / drawingUnitDimensions.width);
	camera.position.assign(snapshotStyle.position.multiply(-1));
	drawing.setDimensions(width, height);
	await drawing.drawerReady();
	drawing.getWithoutTaintedShapes().drawAsSingleLayer(drawer, camera);
	drawing.disconnect();
	drawer.copyToSingleCanvas(canvas);
	return canvas;
};