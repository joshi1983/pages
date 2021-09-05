import { fetchJson } from
'../../../fetchJson.js';

const data = await fetchJson('./json/logo-migrations/l-systems/0L/properties.json');
const nameMap = new Map();
for (const propertyInfo of data) {
	nameMap.set(propertyInfo.primaryName, propertyInfo);
}

export class ZeroLProperties {
	static getAllData() {
		return data;
	}

	static getPropertyInfo(name) {
		name = name.toLowerCase();
		const info = nameMap.get(name);
		return info;
	}
};