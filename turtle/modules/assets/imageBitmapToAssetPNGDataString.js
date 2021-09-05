export function imageBitmapToAssetPNGDataString(imageBitmap) {
	const canvas = document.createElement('canvas');
	canvas.width = imageBitmap.width;
	canvas.height = imageBitmap.height;
	const ctx = canvas.getContext('bitmaprenderer');
	ctx.transferFromImageBitmap(imageBitmap);
	return canvas.toDataURL('image/png');
};