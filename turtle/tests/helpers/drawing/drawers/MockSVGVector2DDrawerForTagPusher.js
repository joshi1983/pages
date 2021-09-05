import { SmartRounder } from '../../../../modules/drawing/vector/shapes/math/SmartRounder.js';

/*
Used as a mock for SVGVector2DDrawer in some tests.
*/
export class MockSVGVector2DDrawerForTagPusher {
	constructor() {
		this.content = [];
		this.rounder = new SmartRounder(0.01);
	}

	getStyleAttributes() {
		return '';
	}

	getSVG() {
		return this.content.join('\n');
	}

	pushTag(content) {
		this.content.push(content);
	}
};