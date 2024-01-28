import { fetchJson } from '../../fetchJson.js';
let dataSet;

export async function asyncInit() {
	const data = await fetchJson('./json/dataTypeContains.json');
	dataSet = new Set(data);
};

export function isDataTypeContainingUsingKey(dataType1, dataType2) {
	if (dataSet === undefined)
		throw new Error(`you must await asyncInit() before calling isDataTypeContainingUsingKey`);
	const key = dataType1.toString() + '-' + dataType2.toString();
	const reverseKey = dataType2.toString() + '-' + dataType1.toString();
	if (dataSet.has(key))
		return true;
	else if (dataSet.has(reverseKey))
		return false;
	if (key === reverseKey)
		return true; // dataType1 is equal to dataType2.
};