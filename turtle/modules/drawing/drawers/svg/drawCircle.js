export function drawCircle(svgDrawer, circle) {
		const centre = circle.position;
		const rounder = svgDrawer.rounder;
		let cx = ` cx="${rounder.formatNumber(centre.getX())}"`;
		if (cx.indexOf('"0"') !== -1)
			cx = '';
		let cy = ` cy="${rounder.formatNumber(centre.getY())}"`;
		if (cy.indexOf('"0"') !== -1)
			cy = '';
		svgDrawer.pushTag(`<circle${cx}${cy} r="` +
		   rounder.formatNumber(circle.radius) + '"' + svgDrawer.getStyleAttributes(circle.style, false) + '/>');	
};