import { LineHint } from '../../../../modules/drawing-menu/download/string-art-kit/LineHint.js';
import { Vector2D } from '../../../../modules/drawing/vector/Vector2D.js';

export function testLineHint(logger) {
	const v1 = new Vector2D(0, 0);
	const v2 = new Vector2D(0, 1);
	const line = new LineHint(v1, v2);
};