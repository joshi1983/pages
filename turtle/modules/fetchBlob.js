export function fetchBlob(url) {
	return fetch(url).then(function(response) {
		return response.blob();
	});
};