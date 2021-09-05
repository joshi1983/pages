import { Colour } from '../../../modules/Colour.js';
import { fetchText } from '../../../modules/fetchText.js';

const coloursContent = await fetchText('json/logo-migrations/python/colours.txt');

export function testColoursTXT(logger) {
	for (const line of coloursContent.split('\n')) {
		const index = line.indexOf(' ');
		const name = line.substring(0, index).trim();
		const hex = line.substring(index + 1).trim();
		if (name.toLowerCase() !== name)
			logger(`Expected every colour name to be in lower case but ${name} is not the same as ${name.toLowerCase()}`);
		if (!hex.startsWith('#'))
			logger(`Expected hex code to start with # but got ${hex}`);
		else if (hex !== hex.toUpperCase())
			logger(`Expected hex to be in upper case but ${hex} is not the same as ${hex.toUpperCase()}`);
		else {
			try {
				new Colour(hex);// check that there's no error thrown while parsing the colour.
			}
			catch (e) {
				logger(`Unable to parse hex code: ${hex}.  Error thrown: ${e}`);
			}
		}
	}
};