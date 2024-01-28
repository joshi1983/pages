import { Colour } from '../../../Colour.js';
import { formatColorRatios } from './formatColorRatios.js';
import { formatPointsValue } from './formatPointsValue.js';
import { toPostScriptLineCap } from './toPostScriptLineCap.js';
import { toPostScriptLineJoin } from './toPostScriptLineJoin.js';
await Colour.asyncInit();

export function updateStrokeStyle(psDrawer, shapeStyle) {
	const newLineJoin = toPostScriptLineJoin(shapeStyle.getLineJoinStyle());
	if (psDrawer.currentLineJoin !== newLineJoin) {
		psDrawer.currentLineJoin = newLineJoin;
		psDrawer.addLine(`${psDrawer.currentLineJoin} setlinejoin`);
	}
	const newLineCap = toPostScriptLineCap(shapeStyle.getLineCap());
	if (psDrawer.currentLineCap !== newLineCap) {
		psDrawer.currentLineCap = newLineCap;
		psDrawer.addLine(`${psDrawer.currentLineCap} setlinecap`);
	}
	if (psDrawer.lineWidth !== shapeStyle.getPenWidth() * psDrawer.scale) {
		psDrawer.lineWidth = shapeStyle.getPenWidth() * psDrawer.scale;
		psDrawer.addLine(`${formatPointsValue(psDrawer.lineWidth)} setlinewidth`);
	}
	if (!shapeStyle.getPenColor().equals(psDrawer.color)) {
		psDrawer.color = new Colour(shapeStyle.getPenColor());
		psDrawer.addLine(`${formatColorRatios(psDrawer.color)} setrgbcolor`);
	}
};