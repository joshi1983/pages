import { Colour } from
'../../../../modules/Colour.js';
import { ColouredLineSegment } from
'../../../../modules/drawing-menu/download/line-segments/ColouredLineSegment.js';
import { LineSegmentsPreviewer } from
'../../../../modules/drawing-menu/download/line-segments/LineSegmentsPreviewer.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function callVariousMethods(viewer) {
	viewer.zoomIn();
	viewer.nudgeIn();
	viewer.zoomOut();
	viewer.nudgeOut();
}

function testBasics(logger) {
	const container = document.createElement('div');
	const viewer = new LineSegmentsPreviewer(container, []);
	/*
	Call all the zoom-related methods to verify they don't trigger a JavaScript error.
	*/
	['nudgeIn', 'nudgeOut', 'zoomIn', 'zoomOut'].forEach(methodName => viewer[methodName]());
	viewer.updateDimensions();
	viewer.redraw();
	viewer.setLineSegments([]);
	callVariousMethods(viewer);
	viewer.dispose();
	const pointCentre = viewer.pointCentre;
	if (!(pointCentre instanceof Vector3D))
		logger(`Expected a Vector3D but got ${pointCentre}`);
}

function testRedrawMustNotMutatePoints(logger) {
	const container = document.createElement('div');
	const p1 = new Vector3D(0, 0, 0);
	const p2 = new Vector3D(-1, 1, 1);
	const cl1 = new ColouredLineSegment(p1, p2, new Colour(0, 0, 0));
	const cl2 = new ColouredLineSegment(new Vector3D(2, 3, 4), new Vector3D(4, 5, 6), new Colour(255, 0, 0));
	const lines = [cl1, cl2];
	const viewer = new LineSegmentsPreviewer(container, lines);
	viewer.redrawNeeded();
	viewer.redraw();
	if (p1.getX() !== 0)
		logger(`p1.getX() expected to be 0 but got ${p1.getX()}`);
	if (p1.getY() !== 0)
		logger(`p1.getY() expected to be 0 but got ${p1.getY()}`);
	if (p1.getZ() !== 0)
		logger(`p1.getZ() expected to be 0 but got ${p1.getZ()}`);
	if (lines[0] !== cl1)
		logger(`cl1 expected to match the first lines[0] but lines[0] = ${lines[0]}`);
	if (p2.getX() !== -1)
		logger(`p2.getX() expected to be -1 but got ${p2.getX()}`);
	if (p2.getY() !== 1)
		logger(`p2.getY() expected to be 1 but got ${p2.getY()}`);
	if (p2.getZ() !== 1)
		logger(`p2.getZ() expected to be 1 but got ${p2.getZ()}`);
	callVariousMethods(viewer);
	viewer.dispose();
}

export function testLineSegmentsPreviewer(logger) {
	wrapAndCall([
		testBasics,
		testRedrawMustNotMutatePoints
	], logger);
};