import { canDrawingBeExportedToLineSegments } from
'../../../modules/drawing-menu/download/line-segments/canDrawingBeExportedToLineSegments.js';
import { canDrawingBeExportedToPointCloud } from
'../../../modules/drawing-menu/download/point-clouds/canDrawingBeExportedToPointCloud.js';
import { canDrawingBeExportedToPostScript } from
'../../../modules/drawing-menu/download/post-script/canDrawingBeExportedToPostScript.js';
import { createDrawingFromCode } from
'../../helpers/createDrawingFromCode.js';
import { delay } from
'../../../modules/delay.js';
import { drawingToLineSegments } from
'../../../modules/drawing-menu/download/line-segments/drawingToLineSegments.js';
import { drawingToPoints } from
'../../../modules/drawing-menu/download/point-clouds/drawingToPoints.js';
import { exceptionToString } from
'../../../modules/exceptionToString.js';
import { getDataURLForDrawingTransformerAndMime } from
'../../../modules/drawing-menu/download/drawing-download/getDataURLForDrawingTransformerAndMime.js';
import { isDrawableToPDF } from '../../../modules/drawing/drawers/pdf/isDrawableToPDF.js';
import { PageSize } from '../../../modules/drawing/drawers/post-script/PageSize.js';
import { PDFDrawer } from '../../../modules/drawing/drawers/PDFDrawer.js';
import { ProgressIndicator } from
'../../helpers/ProgressIndicator.js';
import { SVGVector2DDrawer } from
'../../../modules/drawing/drawers/SVGVector2DDrawer.js';
import { Transformer } from '../../../modules/components/svg-drawing-viewer/Transformer.js';
import { webLogoExamplesContent  } from
'../../helpers/parsing/webLogoExamplesContent.js';

/*
This test executes most of the code needed to export the 1500+ example drawings
in various formats.
This is to look for unhandled exceptions and errors that are thrown in this.
*/
export async function testSimulateAllSupportedExports(logger) {
	const progressIndicator = new ProgressIndicator('testSimulateAllSupportedExports');
	logger.indicators.push(progressIndicator);
	for (let i = 0; i < webLogoExamplesContent.length; i++) {
		const code = webLogoExamplesContent[i];
		try {
			const drawing = createDrawingFromCode(code, logger);
			const svgDrawer = new SVGVector2DDrawer(100, 100);
			drawing.drawAsSingleLayer(svgDrawer);
			if (canDrawingBeExportedToPointCloud(drawing))
				drawingToPoints(drawing);
			if (canDrawingBeExportedToLineSegments(drawing)) {
				const degreesPerSegment = 10;
				drawingToLineSegments(drawing, degreesPerSegment);
			}
			if (canDrawingBeExportedToPostScript(drawing)) {
				const pageSize = PageSize.getDefaultPageSize();
				const transformer = new Transformer(
					pageSize.getWidthPostScriptUnits(), pageSize.getHeightPostScriptUnits());
				const mime = 'application/postscript';
				await getDataURLForDrawingTransformerAndMime(drawing, transformer, mime);
			}
			if (isDrawableToPDF(drawing)) {
				const widthInches = 8.5;
				const heightInches = 11;
				const drawer = new PDFDrawer(widthInches, heightInches);
				drawer.setScreenColor(drawing.getScreenColor());
				drawer.drawShapes(drawing.getShapesArray());
			}
		} catch (e) {
			console.error(e);
			logger(`Exception thrown while simulating exports for WebLogo example ${i}.  The error message is ${exceptionToString(e)}.  The WebLogo code is ${code}`);
			progressIndicator.completed();
			return;
		}
		await delay(5);
		progressIndicator.setProgressRatio(i / webLogoExamplesContent.length);
		progressIndicator.setMessage(`${i} of ${webLogoExamplesContent.length}`);
	}
	progressIndicator.completed();
};