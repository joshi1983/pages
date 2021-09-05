import { fetchJson } from '../../fetchJson.js';
const identifiersData = await fetchJson('json/logo-migrations/processing/identifiers.json');
const identifiersMap = new Map();

function getKey(name, isProperty) {
	if (!isProperty)
		isProperty = 'false';
	return name + '-' + isProperty;
}

identifiersData.forEach(function(info) {
	const key = getKey(info.name, info.isProperty);
	identifiersMap.set(key, info);
});

export class ProcessingIdentifiers {
	static getIdentifierInfo(name, isProperty) {
		const key = getKey(name, isProperty);
		return identifiersMap.get(key);
	}
};