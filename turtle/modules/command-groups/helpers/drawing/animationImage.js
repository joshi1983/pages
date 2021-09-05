import { animatedGifToStaticImageData } from './animatedGifToStaticImageData.js';
import { RasterRectangleShape } from '../../../drawing/vector/shapes/RasterRectangleShape.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

export async function animationImage(turtle, width, height, url, timeRatio) {
	const staticUrl = await animatedGifToStaticImageData(url, timeRatio);
	const drawState = turtle.drawState;
	return new RasterRectangleShape(new Vector3D(drawState.position),
		width, height, drawState.orientation.getHeadingRadians(), staticUrl, 1, drawState.style.deepClone());
};