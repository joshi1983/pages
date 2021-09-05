import { ElementResizeListener } from '../../modules/components/ElementResizeListener.js';

export function testElementResizeListener(logger) {
	const div = document.createElement('div');
	let isCalled = false;
	function callback() {
		isCalled = true;
	}
	div.style.height = '5px';
	div.style.width = '5px';
	document.body.appendChild(div);
	const listener = new ElementResizeListener(div, callback);
	if (isCalled !== false)
		logger(`callback not expected to be called immediately after creating the ElementResizeListener but it was`);

	div.style.height = '15px'; // changed
	const delay = 5000;
	setTimeout(function() {
		if (isCalled !== true)
			logger(`Expected a callback but did not get one after ${delay}ms`);
		listener.dispose();
		document.body.removeChild(div);
	}, delay);
};