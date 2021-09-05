import { Colour } from
'../../Colour.js';
import { fetchJson } from
'../../fetchJson.js';

const colorsData = await fetchJson('json/logo-migrations/kojo/colors.json');
const colorsMap = new Map();
for (const info of colorsData) {
	colorsMap.set(info.name, info);
}

export class KojoColors {
	static hasInfoForName(name) {
		return colorsMap.has(name);
	}

	static nameToWebLogoString(name) {
		const info = colorsMap.get(name);
		if (info === undefined)
			return;

		const webLogoColourRGB = Colour.getColourInfoByName(name);
		if (webLogoColourRGB === undefined)
			return info.hex;

		const webLogoHex = (new Colour(webLogoColourRGB)).to6DigitHTMLCode();
		if (webLogoHex.toLowerCase() !== info.hex)
			return info.hex;

		return name; // Both WebLogo and Kojo have the same hex for the name
			// so it is good to use the name instead of any hex.
	}
	
};