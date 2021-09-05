import { isNumber } from '../../../isNumber.js';
import { PDFDrawer } from '../../../drawing/drawers/PDFDrawer.js';

export function pdfDownload(drawing, widthInches, heightInches, filename) {
	if (!isNumber(widthInches))
		throw new Error('widthInches must be a number.  Not: ' + widthInches);
	if (!isNumber(heightInches))
		throw new Error('heightInches must be a number.  Not: ' + heightInches);

	const drawer = new PDFDrawer(widthInches, heightInches);
	drawer.setScreenColor(drawing.getScreenColor());
	drawer.drawShapes(drawing.getShapesArray());
	drawer.doc.save(filename);
};