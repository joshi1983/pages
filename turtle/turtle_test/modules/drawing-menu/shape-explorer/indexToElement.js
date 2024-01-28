export function indexToElement(index) {
	const result = document.createElement('div');
	result.classList.add('index');
	if (index > 999)
		result.classList.add('compact');
	result.innerText = '' + index;
	return result;
};