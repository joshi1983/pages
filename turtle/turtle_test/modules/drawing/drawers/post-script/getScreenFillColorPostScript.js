import { Colour } from '../../../Colour.js';
import { formatColorRatios } from './formatColorRatios.js';
import { StringBuffer } from '../../../StringBuffer.js';
await Colour.asyncInit();

export function getScreenFillColorPostScript(psDrawer) {
	if ((psDrawer.screenColor instanceof Colour) && !psDrawer.screenColor.equals(Colour.WHITE)) {
		const result = new StringBuffer();
		const width = psDrawer.width;
		const height = psDrawer.height;
		result.append('/setbackgroundcolor {\n');
		result.append('\t0 0 moveto\n');
		result.append(`\t${width} 0 lineto\n`);
		result.append(`\t${width} ${height} lineto\n`);
		result.append(`\t0 ${height} lineto\n`);
		result.append('\tclosepath\n');
		result.append('\tfill\n');
		result.append('} def\n\n');
		result.append(`${formatColorRatios(psDrawer.screenColor)} setrgbcolor\n`);
		result.append('setbackgroundcolor\n');

		// set the color to expected initial value so the next lines 
		// of code would be correct to assume black is the current color.
		if (!psDrawer.screenColor.equals(new Colour('#000')))
			result.append('0 0 0 setrgbcolor\n');

		return result.toString();
	}
	else
		return '';
};