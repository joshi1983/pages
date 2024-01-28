import { getShortestRGBHexCode } from '../../../colour/getShortestRGBHexCode.js';
import { StringBuffer } from '../../../StringBuffer.js';
import { Transparent } from '../../../Transparent.js';

const xmlns = 'http://www.w3.org/2000/svg';

export function getStartTag(drawer) {
	const result = new StringBuffer();
	let xlinkNameSpace = '';
	if (drawer.includesImage) {
		xlinkNameSpace = ' xmlns:xlink="http://www.w3.org/1999/xlink"';
	}
	result.append(`<svg xmlns="${xmlns}"${xlinkNameSpace} width="${drawer.width}" height="${drawer.height}"`);
	if (drawer.screenColour !== Transparent)
		result.append(` style="background-color:${getShortestRGBHexCode(drawer.screenColour)}"`);
	return result.toString() + '>';
};