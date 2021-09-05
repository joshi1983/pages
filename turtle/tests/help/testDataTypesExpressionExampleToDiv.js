import { dataTypesExpressionExampleToDiv } from '../../modules/help/dataTypesExpressionExampleToDiv.js';
import { fetchJson } from '../../modules/fetchJson.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
const data = await fetchJson('json/dataTypesFormatExamples.json');

export function testDataTypesExpressionExampleToDiv(logger) {
	const ids = new Set();
	const options = {
		'showDataTypesHelp': function() {}
		// a mock of showDataTypesHelp module.
		// a mock is used to avoid all the dependencies used by showDataTypesHelp such as Dialog.
	};
	// Check that no errors thrown while calling dataTypesExpressionExampleToDiv 
	// like the showDataTypeExpressionsHelp module does.
	data.forEach(function(exampleInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, name ${exampleInfo.name}`, logger);
		const div = dataTypesExpressionExampleToDiv(exampleInfo, options);
		if (!div.hasAttribute('id'))
			plogger(`Expected id attribute to be set but it is not`);
		else if (div.getAttribute('id') === '')
			plogger(`Expected id attribute to be set to a non-empty string but found an empty string`);
		else {
			const newID = div.id;
			if (ids.has(newID)) {
				plogger(`Duplicate ID found with value "${newID}"`);
			}
			ids.add(newID);
		}
	});
};