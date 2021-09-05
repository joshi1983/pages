import { Colour } from '../../Colour.js';
import { fetchJson } from '../../fetchJson.js';
await Colour.asyncInit();
const colorsData = await fetchJson('json/logo-migrations/sonic-webturtle/colors.json');
const colors = new Map();
for (const obj of colorsData) {
	colors.set(obj.name, obj.hex.toLowerCase());
}

// very similar and has some code duplication with CodeheartTurtleScriptColor.js
// We might want to share code somehow eventually.
export class SonicWebTurtleColor {
	static getAllColoursData() {
		return colorsData;
	}

	static isUniqueToSonicWebTurtle(name) {
		name = name.toLowerCase();
		const chColor = colors.get(name);
		if (chColor === undefined)
			return false;
		const colourInfo = Colour.getColourInfoByName(name);
		if (colourInfo === undefined)
			return true;
		return new Colour(name).to6DigitHTMLCode().toLowerCase() !== chColor;
	}

	static nameToHex(name) {
		name = name.toLowerCase();
		return colors.get(name);
	}
};