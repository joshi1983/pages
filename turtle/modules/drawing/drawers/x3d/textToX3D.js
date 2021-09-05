import { StringUtils } from '../../../StringUtils.js';

export function textToX3D(textShape, result) {
	const font = textShape.style.font;
	result.append(`<Text string="${StringUtils.escapeXMLAttribute(textShape.text)}">`);
	result.append(`<Font family="${StringUtils.escapeXMLAttribute(font.family)}" size="${font.size}"/>`);
	result.append('</Text>');
};