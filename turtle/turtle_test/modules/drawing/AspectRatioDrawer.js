import { Code } from '../components/code-editor/Code.js';
import { fetchJson } from '../fetchJson.js';
import { getSnapshotStyleFromProgram } from './vector/animation/getSnapshotStyleFromProgram.js';
import { GraphicsScreen } from '../components/GraphicsScreen.js';
import { Settings } from '../Settings.js';
import { SnapshotStyle } from './vector/animation/SnapshotStyle.js';
import { Vector2D } from './vector/Vector2D.js';
import { Vector3D } from './vector/Vector3D.js';

let zoomScale = 1;
let snapshotStyle = new SnapshotStyle(new Map());
let shouldDrawAspectRatios = false;
const resolutions = await fetchJson('json/resolutions.json');

const aspectRatios = new Set();
resolutions.forEach(function(resolution) {
	const aspectRatio = resolution.width / resolution.height;
	aspectRatios.add(aspectRatio);
});

function refreshZoomScale() {
	zoomScale = GraphicsScreen.camera.getZoomScale();
}

export function setSnapshotStyle(newSnapshotStyle) {
	if (!(newSnapshotStyle instanceof SnapshotStyle))
		throw new Error(`SnapshotStyle expected but got ${newSnapshotStyle}`);
	snapshotStyle = newSnapshotStyle;
};

function refreshSnapshotStyle() {
	if (Code.latestProgram !== undefined) {
		shouldDrawAspectRatios = Code.latestProgram.procedures.has('animation.setup');
		const getSnapshotPromise = getSnapshotStyleFromProgram(Code.latestProgram, Settings.animationTime, Settings.animationDurationSeconds);
		getSnapshotPromise.then(function(newSnapshotStyle) {
				setSnapshotStyle(newSnapshotStyle);
		}).catch(function(e) {
			console.log('An attempt to get the animation snapshotStyle failed.  '+
			'This is likely due to an underlying problem in the animation.snapshotstyle procedure defined in WebLogo code.  Details: ', e);
		});
	}
	else
		shouldDrawAspectRatios = false;
}

function aspectRatioToRectangleCoordinates(aspectRatio) {
	if (typeof aspectRatio !== 'number')
		throw new Error('aspectRatio must be a number.  Not: ' + aspectRatio);
	const dimensions = snapshotStyle.getDimensionsForAspectRatio(aspectRatio);
	const hw = dimensions.width * 0.5;
	const hh = dimensions.height * 0.5;
	const x = snapshotStyle.position.getX();
	const y = snapshotStyle.position.getY();
	return [
		new Vector2D(x - hw, y - hh), // top left
		new Vector2D(x + hw, y - hh), // top right
		new Vector2D(x + hw, y + hh), // bottom right
		new Vector2D(x - hw, y + hh), // bottom left
		new Vector2D(x - hw, y - hh) // top left(repeated to close the rectangle)
	];
}

function getRectangleCoordinates() {
	const result = [];
	for (let aspectRatio of aspectRatios) {
		result.push(aspectRatioToRectangleCoordinates(aspectRatio));
	}
	return result;
}

Settings.executer.addEventListener('program-changed', refreshSnapshotStyle);
GraphicsScreen.camera.addEventListener('change', refreshZoomScale);
refreshZoomScale();

class PrivateAspectRatioDrawer {
	draw(ctx, camera, drawer) {
		const rectangles = getRectangleCoordinates();
		ctx.strokeStyle = '#080';
		ctx.lineWidth = 1;
		for (let i = 0; i < rectangles.length; i++) {
			const rect = rectangles[i];
			ctx.beginPath();
			for (let j = 0; j < rect.length; j++) {
				const v = rect[j];
				const transformedV = drawer.getTranslatedPosition(camera.transform(new Vector3D(v.getX(), v.getY(), 0)));
				if (j === 0)
					ctx.moveTo(transformedV.getX(), transformedV.getY());
				else
					ctx.lineTo(transformedV.getX(), transformedV.getY());
			}
			ctx.closePath();
			ctx.stroke();
		}
	}

	shouldAspectRatiosAppear() {
		return shouldDrawAspectRatios;
	}
}

const AspectRatioDrawer = new PrivateAspectRatioDrawer();
export { AspectRatioDrawer };