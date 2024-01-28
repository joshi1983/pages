import { StringBuffer } from '../../../StringBuffer.js';

export function getDeclaration(psDrawer) {
	const result = new StringBuffer();
	result.append('%!PS-Adobe-3.0 EPSF-3.0\n');
	result.append('%Produced by WebLogo\n');
	result.append('%%DocumentData: Clean7Bit\n');
	result.append(`%%DocumentMedia: ${psDrawer.pageSize.getShortName()} ${psDrawer.width} ${psDrawer.height} 0 () ()\n`);
	result.append(`%%BoundingBox: 0 0 ${psDrawer.width} ${psDrawer.height}\n`);
	result.append(`%%HiResBoundingBox: 0 0 ${psDrawer.width} ${psDrawer.height}\n`);
	result.append('%%LanguageLevel: 2\n');
	result.append('%%Pages: 1\n%%Page: 1 1\n');
	result.append('%%EndComments\n');
	result.append('%%BeginProlog\n');
	return result.toString();
};