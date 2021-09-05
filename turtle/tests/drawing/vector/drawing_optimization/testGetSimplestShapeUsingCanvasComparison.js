import { compareCanvases } from
'../../../helpers/drawing/drawers/compareCanvases.js';
//import { downloadDataUrl } from '../../../../modules/components/downloadDataUrl.js';
import { drawingToCanvas } from
'../../../helpers/drawing/drawers/drawingToCanvas.js';
import { EllipseArcShape } from
'../../../../modules/drawing/vector/shapes/EllipseArcShape.js';
import { getSimplestShape } from
'../../../../modules/drawing/vector/drawing_optimization/getSimplestShape.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { Vector2DDrawing } from
'../../../../modules/drawing/vector/Vector2DDrawing.js';
import { Vector3D } from
'../../../../modules/drawing/vector/Vector3D.js';

export function testGetSimplestShapeUsingCanvasComparison(logger) {
	const cases = [
		{'shapes': [new EllipseArcShape(new Vector3D(0, 10, 0), 0, 10, 10, Math.PI, 0)]},
		{'shapes': [new EllipseArcShape(new Vector3D(0, 10, 0), Math.PI, 10, 10, Math.PI, 0)]},
		{'shapes': [new EllipseArcShape(new Vector3D(0, 10, 0), -Math.PI, 10, 10, Math.PI, 0)]},
		{'shapes': [new EllipseArcShape(new Vector3D(0, 10, 0), 0.1, 10, 10, Math.PI, 0)]},
		{'shapes': [new EllipseArcShape(new Vector3D(0, 10, 0), 0.1, 10, 10, 0.2, 0)]}
	];
	cases.forEach(function(caseInfo, index) {
		const width = 30;
		const height = 30;
		let threshold = 0.002;
		const drawingBefore = new Vector2DDrawing();
		drawingBefore.addForegroundShapes(caseInfo.shapes, false);
		const drawingAfter = new Vector2DDrawing();
		drawingAfter.addForegroundShapes(caseInfo.shapes.map(getSimplestShape), false);
		const canvasBefore = drawingToCanvas(drawingBefore, width, height);
		const canvasAfter = drawingToCanvas(drawingAfter, width, height);
		const pixelGap = 1;
		const result = compareCanvases(canvasBefore, canvasAfter, pixelGap);
		/*
		The following code can be useful sometimes when you want to verify that the shapes are
		showing in the tested region of the canvases.
		This is commented out because downloading this is slow and doesn't affect the test results.

		const filename1 = `before_${index}.jpg`;
		downloadDataUrl(filename1, canvasBefore.toDataURL());
		const filename2 = `after_${index}.jpg`;
		downloadDataUrl(filename2, canvasAfter.toDataURL());
		*/
		if (result > threshold) {
			const plogger = prefixWrapper(`Case ${index}`, logger);
			plogger(`Expected the drawings to look the same within a tolerance threshold of ${threshold} but found a difference of ${result}`);
		}
	});
};