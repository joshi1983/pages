import { fetchJson } from '../../../fetchJson.js';
import { getSingleScreenNumber } from './getSingleScreenNumber.js';

const colors = await fetchJson('json/logo-migrations/qbasic/colors.json');

function getColorsForScreen(screenNumber) {
	for (const ruleData of colors.rules) {
		if (ruleData.screenNumbers.indexOf(screenNumber) !== -1) {
			return ruleData.colorMap.map(pair => colors.colors[pair[1]]);
		}
	}
	return colors.colors;
}

export function getColorsCode(root) {
	const singleScreenNumber = getSingleScreenNumber(root);
	let paletteAssignment = 'make "paletteColors ';
	if (singleScreenNumber !== undefined) {
		paletteAssignment += '[ ' + getColorsForScreen(singleScreenNumber).map(c => '"' + c.hex).join(' ') + ']';
	}
	else {
		paletteAssignment = '';
	}
	return `${paletteAssignment}\nto qbColorIndexToColor :index
	output ${paletteColors === '' ? :index : 'item 1 + :index :paletteColors'}
end`;
};