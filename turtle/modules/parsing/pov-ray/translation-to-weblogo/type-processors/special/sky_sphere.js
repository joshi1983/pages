import { clamp } from '../../../../../clamp.js';
import { getAllDescendentsAsArray } from
'../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getAverageColourHexCode } from
'../helpers/getAverageColourHexCode.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { PovRayColor } from '../../../PovRayColor.js';

function isColorName(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return PovRayColor.nameToHex(token.val) !== undefined;
}

// For example, color Red
function colorToHex(colorToken) {
	if (colorToken.children.length === 1) {
		const child = colorToken.children[0];
		if (child.type === ParseTreeTokenType.IDENTIFIER) {
			const hex = PovRayColor.nameToHex(child.val);
			if (hex !== undefined) {
				return hex;
			}
		}
	}
}

// For example, rgb <1, 1, 1>
function rgbToHex(rgbToken) {
	if (rgbToken.children.length === 1) {
		const child = rgbToken.children[0];
		if (child.type === ParseTreeTokenType.VECTOR_EXPRESSION) {
			let result = '#';
			for (const t of child.children) {
				if (t.type === ParseTreeTokenType.NUMBER_LITERAL) {
					const val = clamp(parseFloat(t.val), 0, 1);
					let digits = Math.round(val * 255).toString(16);
					if (digits.length === 1)
						digits = '0' + digits;
					result += digits;
				}
			}
			if (result.length === 7)
				return result;
		}
	}
}

function getColour(token) {
	const allDescendents = getAllDescendentsAsArray(token);
	const colors = allDescendents.filter(t => t.val === 'color');
	const rgbs = allDescendents.filter(t => t.val === 'rgb');
	const parentsToExclude = new Set(colors.concat(rgbs));
	const colorNames = allDescendents.filter(isColorName).filter(t => !parentsToExclude.has(t.parentNode));
	const hexes = [];
	colors.forEach(c => {
		const hex = colorToHex(c);
		if (hex !== undefined)
			hexes.push(hex);
	});
	rgbs.forEach(rgb => {
		const hex = rgbToHex(rgb);
		if (hex !== undefined)
			hexes.push(hex);
	});
	colorNames.forEach(colorName => {
		const hex = PovRayColor.nameToHex(colorName.val);
		if (hex !== undefined)
			hexes.push(hex);
	});
	if (hexes.length === 0)
		return;
	return getAverageColourHexCode(hexes);
}

export function sky_sphere(token, result, settings) {
	const c = getColour(token);
	if (c !== undefined) {
		result.append(`setScreenColor "${c}`);
	}
};