const canvas = document.createElement('canvas');
canvas.setAttribute('width', 1);
canvas.setAttribute('height', 1);
const context2D = canvas.getContext('2d');

export function readPixel(image, xRatio, yRatio) {
	const minYRatio = -image.height / 2 / image.width;
	const pixelX = Math.floor((xRatio + 0.5) * image.width);
	const pixelY = Math.floor((yRatio - minYRatio) * image.width);
	if (pixelX < 0 || pixelY < 0 || pixelX >= image.width || pixelY >= image.height)
		return [0, 0, 0, 0];
	context2D.drawImage(image, -pixelX, -pixelY);
	const data = context2D.getImageData(0, 0, 1, 1, {
		'pixelFormat': 'rgba-unorm8'
	});
	context2D.clearRect(0, 0, 1, 1);
	return data.data;
};