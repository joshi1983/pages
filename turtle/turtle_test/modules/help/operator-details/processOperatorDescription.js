export function processOperatorDescription(operatorInfo) {
	const description = document.getElementById('operator-description');
	description.innerHTML = operatorInfo.description;
};