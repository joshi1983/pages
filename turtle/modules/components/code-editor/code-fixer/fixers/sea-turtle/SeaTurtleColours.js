import { fetchText } from '../../../../../fetchText.js';
import { isValidIdentifier } from './scanning/isValidIdentifier.js';

const coloursData = await fetchText('json/logo-migrations/sea-turtle/colours.txt');
const coloursMap = new Map();
const coloursArray = [];
for (const line of coloursData.trim().split('\n')) {
	const parts = line.split(' ').filter(s => s.trim() !== '').map(s => s.trim());
	if (parts.length === 2) {
		const index = parseInt(parts[0]);
		const name = parts[1].toLowerCase();
		if (isValidIdentifier(name) && Number.isInteger(index)) {
			const info = {
				'name': name,
				'index': index
			};
			coloursMap.set(name, info);
			coloursMap.set('' + index, info);
			coloursArray.push(info);
		}
	}
}

export class SeaTurtleColours {
	static getAll() {
		return coloursArray;
	}

	static getColourInfo(name) {
		return coloursMap.get(name.toLowerCase());
	}
};