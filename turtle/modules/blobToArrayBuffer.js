export function blobToArrayBuffer(blob) {
	if (!(blob instanceof Blob))
		throw new Error(`blob must be a Blob but got ${blob}`);
	return new Promise(function(resolve, reject) {
		const fileReader = new FileReader();
		fileReader.onload = function(event) {
			resolve(event.target.result);
		};
		fileReader.readAsArrayBuffer(blob);
	});
};