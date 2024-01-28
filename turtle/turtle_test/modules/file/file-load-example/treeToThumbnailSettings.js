import { getAnimationSetup } from '../../drawing/vector/animation/getAnimationSetup.js';

export async function treeToThumbnailSettings(program) {
	const result = await getAnimationSetup(program);
	return {
		'animationTime': result.get('thumbnailTime'),
		'animationDurationSeconds': result.get('duration')
	};
};