import { dataTypesToEnglish } from './command-details/dataTypesToEnglish.js';

const namesNotToConvert = new Set([
'boolean',
'instruction list',
'integer',
'list',
'number',
'property list'
]);

export function helpUrlToEnglish(helpUrl) {
	if (helpUrl === 'color')
		return helpUrl;
	const name = helpUrl.substring(0, helpUrl.lastIndexOf('.')).replaceAll('-', ' ');
	if (namesNotToConvert.has(name))
		return name;
	return dataTypesToEnglish(name);
};