import { formatDegreeAngle } from '../../vector/shapes/math/formatDegreeAngle.js';
import { MathCommands } from '../../../command-groups/MathCommands.js';

export function drawEllipse(svgDrawer, ellipse) {
	const rounder = svgDrawer.rounder;
	if (ellipse.style.getFillGradient() === undefined) {
		let rx = ` rx="${rounder.formatNumber(ellipse.radius1)}"`;
		if (rx.indexOf('"0"') !== -1)
			rx = '';
		let ry = ` ry="${rounder.formatNumber(ellipse.radius2)}"`;
		if (ry.indexOf('"0"') !== -1)
			ry = '';
		let transform = ' transform="' + svgDrawer.getTranslation(ellipse.position);
		if (ellipse.rotationRadians !== 0) {
			transform += ' rotate(' + formatDegreeAngle((-ellipse.rotationRadians) / MathCommands.degToRadianScale) + ')';
		}
		transform += '"';
		if (transform.indexOf('=""') !== -1)
			transform = '';
		let s = `<ellipse${rx}${ry}` + svgDrawer.getStyleAttributes(ellipse.style, false);
		s += transform;
		svgDrawer.pushTag(s + '/>');
	}
	else {
		const p = ellipse.getLowestPoint();
		const tinyOffset = Math.min(ellipse.radius1, ellipse.radius2) * 0.001;
		let s = `<path d="M ${rounder.formatNumber(p.getX())} ${rounder.formatNumber(p.getY())}` +
		` a ${this.rounder.formatNumber(ellipse.radius1)} ${
			this.rounder.formatNumber(ellipse.radius2)
		} ${formatDegreeAngle(-ellipse.rotationRadians / MathCommands.degToRadianScale)} 1 0 ${tinyOffset} 0" ` +
			svgDrawer.getStyleAttributes(ellipse.style, false);
		svgDrawer.pushTag(s + '/>');
	}
};