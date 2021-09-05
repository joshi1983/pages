import { fetchJson } from
'../../../../modules/fetchJson.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { validateIdentifier } from
'../../../../modules/parsing/parse-tree-analysis/validateIdentifier.js';

function validateProperty(propertyInfo, logger) {
	if (propertyInfo.primaryName === undefined)
		logger(`primaryName must be specified in each property.`);
	for (const key of ['primaryName', 'description']) {
		const val = propertyInfo[key];
		if (val !== undefined && typeof val !== 'string')
			logger(`${key} should be a string if it is specified.`);
	}
	if (propertyInfo.names !== undefined) {
		if (!(propertyInfo.names instanceof Array))
			logger(`names must either not be specified or be an Array but found ${propertyInfo.names}`);
		for (const name of propertyInfo.names) {
			if (typeof name !== 'string')
				logger(`Every element of names must be a string but found ${name}`);
		}
	}
	if (propertyInfo.to !== undefined) {
		if (typeof propertyInfo.to !== 'string')
			logger(`to must either be undefined or be a string but found ${propertyInfo.to}`);
		else if (validateIdentifier(propertyInfo.to) !== undefined) {
			logger(`to must either be undefined or be a valid WebLogo identifier but found ${propertyInfo.to}.  Validation message is: ${validateIdentifier(propertyInfo.to)}`);
		}
		if (propertyInfo.defaultValue === undefined)
			logger(`When to is specified, defaultValue should also be specified.`);
	}
}

export async function testPropertiesJSON(logger) {
	const data = await fetchJson('json/logo-migrations/l-systems/0L/properties.json');
	const takenNames = new Set();
	const toValues = new Set();
	if (!(data instanceof Array))
		logger(`An Array is expected but found ${data}`);
	else {
		data.forEach(function(propertyInfo, index) {
			if (typeof propertyInfo !== 'object' || propertyInfo === null) {
				logger(`Every property should be an object but found something else at index ${index}`);
				return;
			}
			const plogger = prefixWrapper(`Property ${index}, primaryName=${propertyInfo.primaryName}`, logger);
			validateProperty(propertyInfo, plogger);
			if (typeof propertyInfo.to === 'string') {
				const toLowerCase = propertyInfo.to;
				if (toValues.has(toLowerCase))
					plogger(`to must be distinct/unique if specified.  Duplicate found for ${toLowerCase}.`);
				else
					toValues.add(toLowerCase);
			}
			if (index !== 0) {
				const prev = data[index - 1];
				if (prev.primaryName >= propertyInfo.primaryName)
					plogger(`Properties should be sorted by primaryName.`);
			}
			const newNames = new Set();
			if (typeof propertyInfo.primaryName === 'string')
				newNames.add(propertyInfo.primaryName);
			if (propertyInfo.names instanceof Array) {
				for (const name of propertyInfo.names) {
					if (typeof name === 'string') {
						newNames.add(name);
					}
				}
			}
			for (const newName of newNames) {
				if (takenNames.has(newName))
					plogger(`Duplicate name found ${name}`);
				else
					takenNames.add(newName);
			}
		});
	}
};