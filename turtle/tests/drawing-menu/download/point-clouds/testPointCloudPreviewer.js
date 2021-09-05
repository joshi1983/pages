import { Colour } from
'../../../../modules/Colour.js';
import { PointCloudPoint } from
'../../../../modules/drawing-menu/download/point-clouds/PointCloudPoint.js';
import { PointCloudPreviewer } from
'../../../../modules/drawing-menu/download/point-clouds/PointCloudPreviewer.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function testBasics(logger) {
	const container = document.createElement('div');
	const viewer = new PointCloudPreviewer(container, []);
	/*
	Call all the zoom-related methods to verify they don't trigger a JavaScript error.
	*/
	['nudgeIn', 'nudgeOut', 'zoomIn', 'zoomOut'].forEach(methodName => viewer[methodName]());
	viewer.updateDimensions();
	viewer.redraw();
	viewer.setPoints([]);
	viewer.dispose();
	const pointCentre = viewer.pointCentre;
	if (!(pointCentre instanceof Vector3D))
		logger(`Expected a Vector3D but got ${pointCentre}`);
}

function testRedrawMustNotMutatePoints(logger) {
	const container = document.createElement('div');
	const p1 = new Vector3D(0, 0, 0);
	const p2 = new Vector3D(-1, 1, 1);
	const cp1 = new PointCloudPoint(p1, new Colour(0, 0, 0));
	const cp2 = new PointCloudPoint(p2, new Colour(0, 0, 0));
	const points = [p1, p2];
	const cloudPoints = [cp1, cp2];
	const viewer = new PointCloudPreviewer(container, cloudPoints);
	viewer.redrawNeeded();
	viewer.redraw();
	if (p1.getX() !== 0)
		logger(`p1.getX() expected to be 0 but got ${p1.getX()}`);
	if (p1.getY() !== 0)
		logger(`p1.getY() expected to be 0 but got ${p1.getY()}`);
	if (p1.getZ() !== 0)
		logger(`p1.getZ() expected to be 0 but got ${p1.getZ()}`);
	if (points[0] !== p1)
		logger(`p1 expected to match the first points[0] but points[0] = ${points[0]}`);
	if (p2.getX() !== -1)
		logger(`p2.getX() expected to be -1 but got ${p2.getX()}`);
	if (p2.getY() !== 1)
		logger(`p2.getY() expected to be 1 but got ${p2.getY()}`);
	if (p2.getZ() !== 1)
		logger(`p2.getZ() expected to be 1 but got ${p2.getZ()}`);
	viewer.dispose();
}

export function testPointCloudPreviewer(logger) {
	wrapAndCall([
		testBasics,
		testRedrawMustNotMutatePoints
	], logger);
};