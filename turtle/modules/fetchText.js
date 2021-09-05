export function fetchText(url) {
	return fetch(url).then(function(response) {
		return response.text();
	});
}