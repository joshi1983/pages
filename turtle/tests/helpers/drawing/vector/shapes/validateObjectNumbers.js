import { isNumber } from '../../../../../modules/isNumber.js';

export function validateObjectNumbers(object, numberProperties, logger) {
	numberProperties.forEach(function(propertyName) {
		if (!isNumber(object[propertyName]))
			logger(`Expected ${propertyName} to be a number but got ${object[propertyName]}`);
	});
};