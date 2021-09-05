import { Abstract3DPreviewer } from '../Abstract3DPreviewer.js';
import { Colour } from '../../../Colour.js';
import { drawPointCloud } from './drawPointCloud.js';
import { PerspectiveTransformer } from '../../../drawing/drawers/transformers/PerspectiveTransformer.js';
import { pointsToBackgroundColour } from './pointsToBackgroundColour.js';
import { RotatingTransformer } from './RotatingTransformer.js';
import { sortPointCloudPoints } from './sortPointCloudPoints.js';
import { updatePointCentre } from './updatePointCentre.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';
await Colour.asyncInit();

export class PointCloudPreviewer extends Abstract3DPreviewer {
	constructor(container, points) {
		super(container);
		this.backgroundColour = new Colour("white");
		container.appendChild(this.canvas);
		const outer = this;
		this._resized = function() {outer.updateDimensions();};
		window.addEventListener('resize', this._resized);
		this.t = setInterval(function() {outer.redraw();}, 30);
		if (points !== undefined)
			this.setPoints(points);
		this.rotatingTransformer = new RotatingTransformer(this);
	}

	dispose() {
		clearInterval(this.t);
		window.removeEventListener('resize', this._resized);
		this.rotatingTransformer.dispose();
		this.root.removeChild(this.canvas);
		this.root = undefined;
	}

	redraw() {
		if (this._redrawNeeded === true) {
			const box = this.root.getBoundingClientRect();
			this.canvas.setAttribute('width', box.width);
			this.canvas.setAttribute('height', box.height);
			this.perspectiveTransformer.setDimensions(box.width, box.height);
			this._redrawNeeded = false;
			let points = this.points;
			if (this.rotatingTransformer !== undefined) {
				const r = this.rotationRadius === undefined ? 200 : this.rotationRadius * 1.3;
				this.perspectiveTransformer.position.assign(new Vector3D(0, 0, -r));
				points = this.rotatingTransformer.getTransformedPoints(points);
				sortPointCloudPoints(points);
			}
			drawPointCloud(this.canvas, this.perspectiveTransformer, points, this.backgroundColour);
			this._lastRedrawTime = (new Date).getTime();
			this._redrawNeeded = false;
		}
	}

	setPoints(points) {
		if (!(points instanceof Array))
			throw new Error(`points must be an Array.  Not: ${points}`);
		this.points = points;
		this.backgroundColour = pointsToBackgroundColour(points);
		updatePointCentre(this);
		this.redrawNeeded();
	}

};