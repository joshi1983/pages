import { NamedValue } from '../../../../modules/drawing-menu/shape-explorer/object-explorer/NamedValue.js';

export function testNamedValue(logger) {
	const namedValue = new NamedValue('key1', "Hello", "");
	const div = namedValue.toDiv();
	if (!(div instanceof Element))
		logger('toDiv() expected to return an Element but got: ' + div);
	namedValue.unbind();
};