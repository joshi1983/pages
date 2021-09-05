import { SonicWebTurtleColor } from '../SonicWebTurtleColor.js';
import { StringBuffer } from '../../../StringBuffer.js';
import { StringUtils } from '../../../StringUtils.js';
const colorPalettePairs = new StringBuffer();
const colorPaletteLiteral = new StringBuffer();
colorPaletteLiteral.append('[');
colorPalettePairs.append('[');
for (const color of SonicWebTurtleColor.getAllColoursData()) {
	colorPaletteLiteral.append('"' + color.hex + ' ');
	colorPalettePairs.append(`["${color.name} "${color.hex}] `);
}
colorPaletteLiteral.append(']');
colorPalettePairs.append(']');
const replacementPairs = [
	['$$$COLOR_PALETTE$$$', colorPaletteLiteral.toString()],
	['$$$COLOR_PALETTE_PAIRS$$$', colorPalettePairs.toString()]
];

export function processProcedureCodeTemplate(code) {
	return StringUtils.replacePairs(code, replacementPairs);
};