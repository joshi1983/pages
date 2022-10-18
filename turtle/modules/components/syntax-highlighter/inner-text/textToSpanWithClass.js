export function textToSpanWithClass(innerText, className) {
	const result = document.createElement('span');
	result.classList.add(className);
	result.innerText = innerText;
	return result;
};