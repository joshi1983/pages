import { findFont } from '../../../../modules/drawing/drawers/pdf/findFont.js';

export function testFindFont(logger) {
	const fonts = {
		'courier': [''],
		'Courier': ['normal', 'bold', 'italic'],
		'zapfdingbats': ['']
	};
	const result = findFont(fonts, 'Arial');
	if (result === undefined)
		logger('findFont not expected to return undefined');
};