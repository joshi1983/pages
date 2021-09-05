import { dataTypesToEnglish } from '../command-details/dataTypesToEnglish.js';

export function processOperatorOutputs(operatorInfo) {
	const operatorOutputTypes = document.getElementById('operator-output-types');
	operatorOutputTypes.innerText = dataTypesToEnglish(operatorInfo.returnTypes);
};