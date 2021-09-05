import { CircleShape } from '../../../modules/drawing/vector/shapes/CircleShape.js';
import { Colour } from '../../../modules/Colour.js';
import { createTestPDFDrawing } from '../../helpers/createTestPDFDrawing.js';
import { PDFDrawer } from '../../../modules/drawing/drawers/PDFDrawer.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { ShapeStyle } from '../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { Transparent } from '../../../modules/Transparent.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

const PDFDocument = window.PDFLib.PDFDocument;
const PDFDisplayBox = window.PDFLib.PDFDisplayBox;

function testBasic(logger) {
	const drawing = createTestPDFDrawing();
	const width = 8.5;
	const height = 11;
	const drawer = new PDFDrawer(width, height);
	drawing.drawAsSingleLayer(drawer);
}

function verifyMediaBox(doc, inches, logger) {
	const firstPage = doc.getCurrentPageInfo().pageContext;
	const pointsWidth = inches[0] * 72;
	const pointsHeight = inches[1] * 72;
	const mediaBox = firstPage.mediaBox;
	const mediaWidth = mediaBox.topRightX - mediaBox.bottomLeftX;
	const mediaHeight = mediaBox.topRightY - mediaBox.bottomLeftY;
	if (pointsWidth !== mediaWidth)
		logger(`Expected mediaBox to have width ${pointsWidth} but got ${mediaWidth}`);
	if (pointsHeight !== mediaHeight)
		logger(`Expected mediaBox to have height ${pointsHeight} but got ${mediaHeight}`);
}

function testDimensions(logger) {
	const cases = [
		[8.5, 11],
		[11, 8.5],
		[44, 34],
	];
	const drawing = createTestPDFDrawing();
	cases.forEach(async function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const drawer = new PDFDrawer(caseInfo[0], caseInfo[1]);
		drawer.setDimensions(caseInfo[0], caseInfo[1]);
		verifyMediaBox(drawer.doc, caseInfo, plogger);
		drawing.drawAsSingleLayer(drawer);
		drawer.setDimensions(caseInfo[0], caseInfo[1]);
		const existingPdfBytes = drawer.doc.output('arraybuffer');
		if (drawer.doc.internal.getNumberOfPages() !== 1)
			plogger(`Expected number of pages to be 1 but got ${drawer.doc.internal.getNumberOfPages()}`);
		verifyMediaBox(drawer.doc, caseInfo, plogger);
		const width = drawer.doc.getPageWidth(0); // in inches
		const height = drawer.doc.getPageHeight(0); // in inches
		if (width !== caseInfo[0])
			plogger(`Expected width to be ${caseInfo[0]} but got ${width}`);
		if (height !== caseInfo[1])
			plogger(`Expected height to be ${caseInfo[1]} but got ${height}`);

		// use PDFLib to see if it finds the same page dimensions.
		const pdfDoc = await PDFDocument.load(existingPdfBytes);
		const page = pdfDoc.getPage(0);
		const pdfLibWidth = page.getWidth() / 72;
		const pdfLibHeight = page.getHeight() / 72;
		if (pdfLibWidth !== caseInfo[0])
			plogger(`Page width expected to be ${caseInfo[0]} but got ${pdfLibWidth} inches`);
		if (pdfLibHeight !== caseInfo[1])
			plogger(`Page height expected to be ${caseInfo[1]} but got ${pdfLibHeight} inches`);
	});
}

function testTransparent(logger) {
	const width = 8.5;
	const height = 11;
	const drawer = new PDFDrawer(width, height);
	const colors = [new Colour('red'), Transparent];
	colors.forEach(function(penColor) {
		colors.forEach(function(fillColor) {
			const style = new ShapeStyle();
			style.setPenColor(penColor);
			style.setFillColor(fillColor);
			drawer.drawCircle(new CircleShape(new Vector3D(0, 0, 0), 5, style));
		});
	});
}

export function testPDFDrawer(logger) {
	wrapAndCall([
		testBasic,
		testDimensions,
		testTransparent
	], logger);
};