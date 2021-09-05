import { updateFillStyle } from './updateFillStyle.js';
import { updateStrokeStyle } from './updateStrokeStyle.js';

export function processFillableShapeStyle(psDrawer, shapeStyle) {
	if (shapeStyle.isPenVisible()) {
		if (shapeStyle.usesFill()) {
			psDrawer.addLine('gsave');
			updateFillStyle(psDrawer, shapeStyle);
			psDrawer.addLine('fill');
			psDrawer.addLine('grestore');

			psDrawer.color = undefined;
			// grestore resets the color too.
			// We want any following PostScript code to always set the color
			// to avoid any bugs related to the incorrect color being drawn.
		}
		updateStrokeStyle(psDrawer, shapeStyle);
		psDrawer.addLine('stroke');
	}
	else if (shapeStyle.usesFill()) {
		updateFillStyle(psDrawer, shapeStyle);
		psDrawer.addLine('fill');
	}
};
