import { LogoInstruction } from '../../parsing/execution/instructions/LogoInstruction.js';

function getPropertiesElementFor(instruction) {
	const propertiesElement = document.createElement('div');
	propertiesElement.classList.add('properties');
	const dto = instruction.toDTO();
	for (const key in dto) {
		if (key !== 'name') {
			const keyElement = document.createElement('span');
			keyElement.classList.add('key');
			keyElement.innerText = key + ':';
			const valueElement = document.createElement('span');
			valueElement.classList.add('value');
			valueElement.innerText = dto[key];
			const keyValueElement = document.createElement('span');
			keyValueElement.appendChild(keyElement);
			keyValueElement.appendChild(valueElement);
			propertiesElement.appendChild(keyValueElement);
		}
	}
	return propertiesElement;
}

export function instructionToElement(index, instruction) {
	if (typeof index !== 'number')
		throw new Error('index must be a number');
	if (!(instruction instanceof LogoInstruction))
		throw new Error('instruction must be an instance of LogoInstruction');

	const result = document.createElement('div');
	const indexElement = document.createElement('div');
	indexElement.classList.add('index');
	indexElement.innerText = '' + index;
	const nameElement = document.createElement('div');
	nameElement.classList.add('name');
	nameElement.innerText = instruction.toDTO().name;
	const propertiesElement = getPropertiesElementFor(instruction);
	result.appendChild(indexElement);
	result.appendChild(nameElement);
	result.appendChild(propertiesElement);
	return result;
};