import { OptionList } from '../../modules/components/OptionList.js';

function getDistinctID() {
	const prefix = 'option-list-test-';
	let i = 1;
	while (true) {
		const id = prefix + i;
		const e = document.getElementById(id);
		if (e === null)
			return id;
		i++;
	}
}

function getOptionListChildElements(div) {
	const nodes = div.querySelectorAll(':scope > *');
	const result = [];
	for (let i = 0; i < nodes.length; i++) {
		result.push(nodes[i]);
	}
	return result;
}

export function testOptionList(logger) {
	const id = getDistinctID();
	const div = document.createElement('div');
	const body = document.body;
	const optionsData = [
		{'text': 'TestText', 'value': 1},
		{'text': 'TestText2', 'value': 2}
	];
	div.setAttribute('id', id);
	body.appendChild(div);
	const optionList = new OptionList(id, optionsData);
	let selectCount = 0;
	optionList.addEventListener('selection-changed', function(eventInfo) {
		selectCount++;
	});
	const childElements = getOptionListChildElements(div);
	if (childElements.length !== 2)
		logger(`Expected there to be 2 children after constructing OptionList but got ${chilElements.length}`);
	else {
		const lastChild = childElements[childElements.length - 1];
		const clickEvent = new Event('click');
		lastChild.dispatchEvent(clickEvent);
		lastChild.dispatchEvent(clickEvent);
		lastChild.dispatchEvent(clickEvent);
		lastChild.dispatchEvent(clickEvent);
		if (selectCount === 0)
			logger(`Expected a selection-changed event to be dispatched but it wasn't.`);
		else if (selectCount > 1)
			logger(`Expected 1 selection-changed event to be dispatched but counted ${selectCount}.  When the same option is clicked more than once, only 1 event should be dispatched.`);
		optionList.setSelectedInnerText(lastChild.innerText);
	}
	optionList.dispose();
	div.remove();
};