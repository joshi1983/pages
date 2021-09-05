import { Colour } from '../../../../../Colour.js';
import { isNumber } from '../../../../../isNumber.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function getRegisterValueAt(token) {
	const prev = token.getPreviousSibling();
	if (prev !== null && prev.type === ParseTreeTokenType.INSTRUCTION &&
	prev.val.toLowerCase() === 'load' && prev.children.length === 1 &&
	prev.children[0].type === ParseTreeTokenType.NUMBER_LITERAL) {
		return parseFloat(prev.children[0].val);
	}
}

function asmTurtleNumberToWebLogoColourString(num) {
	num = Math.floor(Math.max(0, num));
	const red = num & 0xff;
	const green = (num >> 8) & 0xff;
	const blue = (num >> 16) & 0xff;
	return new Colour(red, green, blue).toString();
}

export function setcolor(token, result, settings) {
	const val = getRegisterValueAt(token);
	if (isNumber(val))
		result.append(`setPenColor "${asmTurtleNumberToWebLogoColourString(val)}`);
	else
		result.append(`setPenColor asmTurtleColor :${settings.registerName}`);
};