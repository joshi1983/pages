import { updateFillStyle } from './updateFillStyle.js';
import { updateStrokeStyle } from './updateStrokeStyle.js';

export function processFillableShapeStyle(psDrawer, shapeStyle) {
	if (shapeStyle.isPenVisible()) {
		if (shapeStyle.usesFill()) {
			psDrawer.addLine('gsave');
			updateFillStyle(psDrawer, shapeStyle);
			psDrawer.addLine('fill');
			psDrawer.addLine('grestore');
		}
		updateStrokeStyle(psDrawer, shapeStyle);
		psDrawer.addLine('stroke');
	}
	else if (shapeStyle.usesFill()) {
		updateFillStyle(psDrawer, shapeStyle);
		psDrawer.addLine('fill');
	}
};
