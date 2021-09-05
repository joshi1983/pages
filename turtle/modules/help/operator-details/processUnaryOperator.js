import { dataTypesToEnglish } from '../command-details/dataTypesToEnglish.js';

export function processUnaryOperator(operatorInfo) {
	const unaryOperatorDetails = document.getElementById('unary-operator-details');
	if (operatorInfo.unary !== undefined) {
		const description = document.getElementById('unary-operator-description');
		description.innerText = operatorInfo.unary.description;
		const unaryName = document.getElementById('unary-operator-name');
		unaryName.innerText = operatorInfo.unary.name;
		const unaryInputTypes = document.getElementById('unary-operator-inputs');
		unaryInputTypes.innerText = dataTypesToEnglish(operatorInfo.unary.arg);
		const outputTypes = document.getElementById('unary-operator-outputs');
		outputTypes.innerText = dataTypesToEnglish(operatorInfo.unary.returnTypes);
		const inputTypesHeading = document.getElementById('unary-input-types-heading');
		if (operatorInfo.unary.arg.indexOf('|') === -1)
			inputTypesHeading.innerText = 'Input Type';
		else
			inputTypesHeading.innerText = 'Input Types';
		const outputTypesHeading = document.getElementById('unary-output-types-heading');
		if (operatorInfo.unary.returnTypes.indexOf('|') === -1)
			outputTypesHeading.innerText = 'Output Type';
		else
			outputTypesHeading.innerText = 'Output Types';
	}
	else {
		unaryOperatorDetails.style.display = 'none';
	}
};