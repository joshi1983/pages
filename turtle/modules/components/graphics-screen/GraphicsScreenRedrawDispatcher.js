import { EventDispatcher } from '../../EventDispatcher.js';
import { GraphicsScreen } from '../GraphicsScreen.js';

class PrivateGraphicsScreenRedrawDispatcher extends EventDispatcher {
	constructor() {
		super(['redrawNeeded']);
		const outer = this;
		function dispatchRedraw() {
			outer._dispatchEvent('redrawNeeded');
		}
		GraphicsScreen.camera.addEventListener('change', dispatchRedraw);
		GraphicsScreen.camera.position.addEventListener('change', dispatchRedraw);
		window.addEventListener('resize', dispatchRedraw);
	}

	addEventListener(key, listener) {
		super.addEventListener(key, listener);
		listener();
	}
};

const GraphicsScreenRedrawDispatcher = new PrivateGraphicsScreenRedrawDispatcher();
export { GraphicsScreenRedrawDispatcher };