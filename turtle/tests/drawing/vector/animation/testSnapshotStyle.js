import { SnapshotStyle } from '../../../../modules/drawing/vector/animation/SnapshotStyle.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testDefaults(logger) {
	const style = new SnapshotStyle(new Map());
	if (style.zoomScale !== 1)
		logger('zoomScale expected to default to 1 but got ' + style.zoomScale);
	if (style.position.getX() !== 0)
		logger('position x expected to default to 0 but got ' + style.position.getX());
}

function testExplicitProperties(logger) {
	const properties = new Map([
		['position.x', 1],
		['position.y', 2],
		['position.z', 3],
		['zoom.scale', 4]
	]);
	const style = new SnapshotStyle(properties);
	if (style.position.getX() !== 1)
		logger('position x expected to be 1 but got ' + style.position.getX());
	if (style.position.getY() !== 2)
		logger('position y expected to be 2 but got ' + style.position.getY());
	if (style.position.getZ() !== 3)
		logger('position z expected to be 3 but got ' + style.position.getZ());
	if (style.zoomScale !== 4)
		logger('zoom scale expected to be 4 but got ' + style.zoomScale);
}

function testGetDimensionsForAspectRatio(logger) {
	const style = new SnapshotStyle(new Map());
	const dimensions = style.getDimensionsForAspectRatio(1);
	if (dimensions.width !== dimensions.height)
		logger('For aspect ratio 1, expected width and height to be equal but got ' + JSON.stringify(dimensions));
	const area = dimensions.width * dimensions.height;
	const dimensions2 = style.getDimensionsForAspectRatio(1.2);
	if (dimensions2.width !== 1.2 * dimensions2.height)
		logger('Expected width to be 1.2 * height or ' + (dimensions2.height * 1.2) + ' but got a width of ' + dimensions2.width);

	style.setZoomScale(2);
	const dimensions3 = style.getDimensionsForAspectRatio(1);
	const area2 = dimensions3.width * dimensions3.height;
	if (area2 !== area / 4)
		logger('Expected area to become 1/4 of the area used at zoomScale 1 which works out to ' + (area / 4) + ' but got ' + area2);
}

export function testSnapshotStyle(logger) {
	wrapAndCall([
		testDefaults,
		testExplicitProperties,
		testGetDimensionsForAspectRatio
	], logger);
};