export function isFormatReadSupported(format, dataUri) {
	return new Promise(function(resolve, reject) {
		const image = new Image();
		image.src = `data:image/${format};base64,${dataUri}`;
		image.onload = () => {
			resolve(true);
		};
		image.onerror = () => {
			reject(format.toUpperCase() + "format not supported");
		};
	});
};