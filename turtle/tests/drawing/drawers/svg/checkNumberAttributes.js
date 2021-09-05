import { scrapeAttributeValue } from './scrapeAttributeValue.js';

const numberAttributes = ['height', 'width', 'x', 'y', 'rx'];

export function checkNumberAttributes(caseInfo, svg, logger) {
	numberAttributes.forEach(function(numberAttribute) {
		if (caseInfo[numberAttribute] !== undefined) {
			let num = scrapeAttributeValue(svg, numberAttribute);
			if (num === undefined) {
				// the default for x and y of SVG's rect element is 0.
				if (numberAttribute === 'x' || numberAttribute === 'y')
					num = 0;
			}
			if (parseInt(num) !== caseInfo[numberAttribute])
				logger(`Expected ${numberAttribute} to be ${caseInfo[numberAttribute]} but got ${num}`);
		}
	});
};