import { dataTypeNameToHelpUrl } from './dataTypeNameToHelpUrl.js';
import { fetchJson } from '../fetchJson.js';
import { helpUrlToEnglish } from './helpUrlToEnglish.js';
import { StringUtils } from '../StringUtils.js';
import { valueToLiteralCode } from '../valueToLiteralCode.js';
const data = await fetchJson('json/dataTypesFormatExamples.json');

function createH4(text) {
	const h4 = document.createElement('h4');
	h4.innerText = text;
	return h4;
}

function helpUrlToSpan(helpUrl, showDataTypesHelp) {
	const span = document.createElement('span');
	span.innerHTML = helpUrlToEnglish(helpUrl);
	span.addEventListener('click', function() {
		showDataTypesHelp(helpUrl);
	});
	return span;
}

function commandNameToSpan(commandName) {
	const span = document.createElement('span');
	span.classList.add('command');
	span.innerText = commandName;
	return span;
}

function typesToElement(typesName) {
	const span = document.createElement('span');
	span.classList.add('example-types');
	if (data.some(e => e.name === typesName)) {
		const a = document.createElement('a');
		a.href = `#${typesNameToID(typesName)}`;
		a.innerText = typesName;
		span.appendChild(a);
	}
	else
		span.innerText = typesName;
	return span;
}

function valueToElement(val) {
	const span = document.createElement('span');
	span.innerText = valueToLiteralCode(val);
	span.classList.add('example-value');
	return span;
}

function typesNameToID(typesName) {
	if (typeof typesName !== 'string')
		throw new Error(`Expected typesName to be a string but got ${typesName}`);
	return StringUtils.replacePairs(typesName, [
		['|', '_'],
		['<', '_'],
		['>', '_'],
		[':', '_']
	]);
}

export function dataTypesExpressionExampleToDiv(exampleInfo, options) {
	const result = document.createElement('div');
	result.setAttribute('id', typesNameToID(exampleInfo.name));
	const nameElement = document.createElement('h3');
	nameElement.innerText = exampleInfo.name;
	result.appendChild(nameElement);
	const descriptionElement = document.createElement('div');
	descriptionElement.innerHTML = exampleInfo.description;
	result.appendChild(descriptionElement);
	if (exampleInfo.examples.length !== 0) {
		const examplesDiv = document.createElement('div');
		examplesDiv.appendChild(createH4(`${exampleInfo.name} includes:`));
		exampleInfo.examples.forEach(function(exampleName) {
			examplesDiv.appendChild(valueToElement(exampleName));
		});
		result.appendChild(examplesDiv);
	}
	if (exampleInfo.notExamples.length !== 0) {
		const notExamplesDiv = document.createElement('div');
		notExamplesDiv.appendChild(createH4(`${exampleInfo.name} does not include:`));
		exampleInfo.notExamples.forEach(function(exampleName) {
			notExamplesDiv.appendChild(valueToElement(exampleName));
		});
		result.appendChild(notExamplesDiv);
	}
	if (exampleInfo.subsetTypes !== undefined && exampleInfo.subsetTypes.length !== 0) {
		const subsetTypesDiv = document.createElement('div');
		subsetTypesDiv.appendChild(createH4(`${exampleInfo.name} contains all values from the following types:`));
		exampleInfo.subsetTypes.forEach(function(subsetTypesName) {
			subsetTypesDiv.appendChild(typesToElement(subsetTypesName));
		});
		result.appendChild(subsetTypesDiv);
	}
	const seeAlsoLinks = [];
	const helpUrl = dataTypeNameToHelpUrl(exampleInfo.name);
	if (helpUrl !== undefined) {
		seeAlsoLinks.push(helpUrlToSpan(helpUrl, options.showDataTypesHelp));
	}
	if (exampleInfo.seeAlso !== undefined) {
		exampleInfo.seeAlso.forEach(function(commandName) {
			seeAlsoLinks.push(commandNameToSpan(commandName));
		});
	}
	if (seeAlsoLinks.length !== 0) {
		const seeAlso = document.createElement('div');
		seeAlso.classList.add('see-also');
		seeAlso.appendChild(createH4('See Also'));
		seeAlsoLinks.forEach(function(link) {
			link.classList.add('hyperlinked');
			seeAlso.appendChild(link);
		});
		result.appendChild(seeAlso);
	}
	return result;
};