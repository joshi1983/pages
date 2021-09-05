import { svgToCanvas } from '../../helpers/drawing/drawers/svgToCanvas.js';

export async function testSVGToCanvas(logger) {
	const canvas = await svgToCanvas(`<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="534" height="495" style="background-color:#000">

<g transform="scale(1, -1), translate(0 0)" fill="#fff">
  <line x2="100" y2="100" />
 </g>
</svg>`, 100, 100);
	if (!(canvas instanceof Element))
		logger('canvas expected to be an Element but got ${canvas}');
	
};