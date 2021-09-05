import { getSingleScreenNumber } from './getSingleScreenNumber.js';
import { QBasicColors } from '../QBasicColors.js';

export function getColorsCode(root) {
	const singleScreenNumber = getSingleScreenNumber(root);
	let paletteAssignment = 'make "paletteColors ';
	if (singleScreenNumber !== undefined) {
		paletteAssignment += '[ ' + QBasicColors.getValuesForScreen(singleScreenNumber).map(c => '"' + c.hex).join(' ') + ']';
	}
	else {
		paletteAssignment = '';
	}
	let result = `${paletteAssignment}\nto qbColorIndexToColor :index\n`;
	if (paletteAssignment !== '') {
		result += `if (and integer? :index :index > 0 :index <= count :paletteColors) [
	output item 1 + :index :paletteColors
]`;
	}
	result += `\nif integer? :index [
	output [(bitAnd 255 :index) ; red
	(bitAnd 255 bitShiftRight :index 8) ; green
	(bitAnd 255 bitShiftRight :index 16) ; blue
	]
]\n`;
	result += `\toutput :index`;
	result += '\nend\n';
	return result;
};