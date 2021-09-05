import { Abstract3DPreviewer } from '../Abstract3DPreviewer.js';
import { Colour } from '../../../Colour.js';
import { drawLineSegments } from './drawLineSegments.js';
import { PerspectiveTransformer } from '../../../drawing/drawers/transformers/PerspectiveTransformer.js';
import { lineSegmentsToBackgroundColour } from './lineSegmentsToBackgroundColour.js';
import { RotatingTransformer } from './RotatingTransformer.js';
import { sortLineSegments } from './sortLineSegments.js';
import { updatePointCentre } from './updatePointCentre.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';
await Colour.asyncInit();

export class LineSegmentsPreviewer extends Abstract3DPreviewer {
	constructor(container, lines) {
		super(container);
		this.backgroundColour = new Colour("white");
		container.appendChild(this.canvas);
		const outer = this;
		this._resized = function() {outer.updateDimensions();};
		window.addEventListener('resize', this._resized);
		this.t = setInterval(function() {outer.redraw();}, 30);
		if (lines !== undefined)
			this.setLineSegments(lines);
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
			let lines = this.lines;
			if (this.rotatingTransformer !== undefined) {
				const r = this.rotationRadius === undefined ? 200 : this.rotationRadius * 1.3;
				this.perspectiveTransformer.position.assign(new Vector3D(0, 0, -r));
				lines = this.rotatingTransformer.getTransformedLines(lines);
				sortLineSegments(lines);
			}
			drawLineSegments(this.canvas, this.perspectiveTransformer, lines, this.backgroundColour);
			this._lastRedrawTime = (new Date).getTime();
			this._redrawNeeded = false;
		}
	}

	setLineSegments(lines) {
		if (!(lines instanceof Array))
			throw new Error(`lines must be an Array.  Not: ${lines}`);
		this.lines = lines;
		this.backgroundColour = lineSegmentsToBackgroundColour(lines);
		updatePointCentre(this);
		this.redrawNeeded();
	}

	updateDimensions() {
		this.redrawNeeded();
	}
};