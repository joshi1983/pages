import { Colour } from '../../Colour.js';
import { fetchJson } from '../../fetchJson.js';
await Colour.asyncInit();
const colorsData = await fetchJson('json/logo-migrations/pov-ray/colors.json');
const colors = new Map();
for (const obj of colorsData) {
	colors.set(obj.name, obj.hex.toLowerCase());
}

export class PovRayColor {
	static isUniqueToPovRay(name) {
		const chColor = colors.get(name);
		if (chColor === undefined)
			return false;
		const colourInfo = Colour.getColourInfoByName(name);
		if (colourInfo === undefined)
			return true;
		return new Colour(name).to6DigitHTMLCode().toLowerCase() !== chColor;
	}

	static nameToHex(name) {
		return colors.get(name);
	}
};