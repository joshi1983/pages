import { PageSize } from '../../../../modules/drawing/drawers/post-script/PageSize.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

function testFillSelect(logger) {
	const selectElement = document.createElement('select');
	PageSize.fillSelect(selectElement);
	const options = selectElement.querySelectorAll(':scope > option');
	if (options.length === 0)
		logger('At least 1 page size option should have been added but none found');
}

function testGetDefaultPageSize(logger) {
	const pageSize = PageSize.getDefaultPageSize();
	if (!(pageSize instanceof PageSize))
		logger('default pageSize expected to be a PageSize');
	if (pageSize.shortName !== 'Letter')
		logger('Expected Letter to be the default page size shortName but got ' + pageSize.shortName);
}

function testGetShortName(logger) {
	PageSize.getPageSizes().forEach(function(pageSize) {
		const shortName = pageSize.getShortName();
		if (typeof shortName !== 'string')
			logger('getShortName() always expected to return a string but got ' + shortName);
	});
}

function testWidthHeight(logger) {
	const pageSize = new PageSize({'name': 'Test', 'dimensionsInch': {
		'width': 1,
		'height': 2
	}}, 0);
	if (pageSize.getWidthInches() !== 1)
		logger('getWidthInches() expected to return 1 but got ' + pageSize.getWidthInches());
	if (pageSize.getHeightInches() !== 2)
		logger('getHeightInches() expected to return 2 but got ' + pageSize.getHeightInches());
	if (pageSize.getHeightPostScriptUnits() !== 144)
		logger('getHeightPostScriptUnits() expected to return 144 but got ' + pageSize.getHeightPostScriptUnits());
	if (pageSize.getWidthPostScriptUnits() !== 72)
		logger('getWidthPostScriptUnits() expected to return 72 but got ' + pageSize.getWidthPostScriptUnits());
	const centre = pageSize.getCentre();
	if (centre.getX() !== 36)
		logger('Expected centre x to be 36 but got ' + centre.getX());
	if (centre.getY() !== 72)
		logger('Expected centre y to be 72 but got ' + centre.getY());
	const pageSize2 = PageSize.getPageSizeClosestToDimensions(100, 100);
	if (!(pageSize2 instanceof PageSize))
		logger('Expected a PageSize from getPageSizeClosestToDimensions but got ' + pageSize2);
}

export function testPageSize(logger) {
	wrapAndCall([
		testFillSelect,
		testGetDefaultPageSize,
		testGetShortName,
		testWidthHeight
	], logger);
};