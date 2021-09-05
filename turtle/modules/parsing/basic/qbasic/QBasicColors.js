import { fetchJson } from
'../../../../modules/fetchJson.js';

const data = await fetchJson('json/logo-migrations/basic/qbasic/colors.json');

export class QBasicColors {
	static getAllData() {
		return data;
	}

	static getValuesForScreen(screenNumber) {
		if (Number.isInteger(screenNumber)) {
			for (const rule of data.rules) {
				if (rule.screenNumbers.indexOf(screenNumber) !== -1) {
					return rule.colorMap.map(index => data.colors[index]);
				}
			}
		}
		return data.colors;
	}
};