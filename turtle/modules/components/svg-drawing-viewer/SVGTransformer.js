import { Transformer } from './Transformer.js';

export class SVGTransformer extends Transformer {
	constructor(g, width, height) {
		if (!(g instanceof Element))
			throw new Error('g must be an Element');
		if (g.tagName !== 'g')
			throw new Error('g must have a tagName of g.  Not: ' + g.tagName);

		super(width, height);
		this.g = g;
	}

	_getTransformAttributeValue() {
		const dx = this.translation.getX();
		const dy = this.translation.getY();
		const translate = 'translate(' + dx + ' ' + (-dy) + ')';
		const scale = 'scale(' + this.scale + ', ' + (-this.scale) + ')';
		return [scale, translate].join(', ').trim();
	}

	_updateG() {
		this.g.setAttribute('transform', this._getTransformAttributeValue());
	}

	clone() {
		const result = new SVGTransformer(this.g, this.width, this.height);
		result.scale = this.scale;
		result.translation = this.translation.deepClone();
		return result;
	}

	getGTag() {
		return '<g transform="' + this._getTransformAttributeValue() + '">';
	}

	setDimensions(width, height) {
		super.setDimensions(width, height);
		this._updateG();
	}

	setScale(scale) {
		super.setScale(scale);
		this._updateG();
	}

	translateBy(v) {
		super.translateBy(v);
		this._updateG();
	}
};