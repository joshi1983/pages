import { updateHexColourDisplay } from '../../modules/components/updateHexColourDisplay.js';

export function testUpdateHexColourDisplay(logger) {
	const cases = [
	{'s': '#fff'},
	{'s': '#ffff'},
	{'s': '#0fff'}
	];
	cases.forEach(function(caseInfo, index) {
		const e = document.createElement('div');
		e.innerText = caseInfo.s;
		updateHexColourDisplay(e);
	});
};