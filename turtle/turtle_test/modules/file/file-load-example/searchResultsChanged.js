/*
Used to prevent needless DOM manipulation, flickering, and needless 
resizing in showLoadExampleDialog.js
when the user types different search queries and the results sometimes don't change.

This also prevents handleCompactKeywords.js from resizing keywords needlessly
which also looks annoying.
*/
export function searchResultsChanged(container, results) {
	const exampleDivs = container.querySelectorAll(':scope > div');
	if (exampleDivs.length !== results.length)
		return true;
	for (let i = 0; i < results.length; i++) {
		const e = exampleDivs[i];
		const exampleNameElement = e.querySelector('.name');
		if (exampleNameElement.innerText !== results[i].name)
			return true;
	}
	return false;
};