import { AlphaColour } from '../../AlphaColour.js';
import { clamp } from '../../clamp.js';
await AlphaColour.asyncInit();

function toHex(val) {
	val = Math.round(clamp(val, 0, 255));
	val = val.toString(16);
	if (val.length == 1)
		val = '0' + val;
	return val;
}

export function cssColorNameToHex(name) {
	if (name.toLowerCase() === 'black')
		return '#000000';
	if (name[0] === '#') {
		// Save a little time if name is already in hex.
		if (AlphaColour.canBeInterprettedAsAlphaColour(name))
			return name;
		return; // invalid hex code
	}
	const div = document.createElement('div');
	div.style.backgroundColor = name;
	document.body.appendChild(div);
	let result = window.getComputedStyle(div).backgroundColor;
	div.remove();
	if (typeof result === 'string') {
		result = result.trim();
		if (result.startsWith('rgb'))
			result = result.substring(3);
		result = result.trim();
		while (result[0] === '(')
			result = result.substring(1);
		while (result[result.length - 1] === ')')
			result = result.substring(0, result.length - 1);
		const values = result.split(',').map(s => parseInt(s.trim())).filter(val => Number.isInteger(val));
		if (values.length === 3) {
			result = '#' + values.map(toHex).join('');
		}
	}
	if (result === '#000000')
		return;
	return result;
};