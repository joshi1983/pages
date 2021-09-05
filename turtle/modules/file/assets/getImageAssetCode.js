import { imageAssetToDimensions } from './imageAssetToDimensions.js';

export async function getImageAssetCode(asset) {
	const dimensions = await imageAssetToDimensions(asset);
	const actualWidth = dimensions.width;
	const actualHeight = dimensions.height;
	const assetName = asset.filename;
	let aspectRatioExpression = '';
	if (actualWidth !== actualHeight) {
		 aspectRatioExpression = ` * ${actualWidth} / ${actualHeight}`;
	}
	const code = `make "height 100
imageAlpha :height${aspectRatioExpression} :height 'local://${assetName}' 0.5`;
	return code;
};