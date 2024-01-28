// Copied from
// https://stackoverflow.com/questions/18650168/convert-blob-to-base64
export function blobToBase64(blob) {
	return new Promise((resolve, _) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.readAsDataURL(blob);
	});
};