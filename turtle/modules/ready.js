/*
Calls the specified callback shortly after the document is loaded
*/
export function ready(callback) {
	if (typeof callback !== 'function')
		throw new Error(`callback must be a function but found ${callback}`);

	if (document.readyState === 'complete')
		callback();
	else
		document.addEventListener("readystatechange", function() {
			if (document.readyState === 'complete')
				callback();
		});
};