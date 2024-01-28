/*
We don't want to refresh the turtle every time a shape 
is drawn because a Logo program can add a shape so frequently 
that redrawing the cursor just as often can hurt performance.

That is why we refresh the cursor only when needed and only up to roughly 30 times per second.
*/
import { GraphicsScreen } from '../GraphicsScreen.js';
import { GraphicsScreenRedrawDispatcher } from './GraphicsScreenRedrawDispatcher.js';

function refreshCursor() {
	if (GraphicsScreen._turtleRefreshRequested === true) {
		GraphicsScreen._refreshTurtle();
	}
}

GraphicsScreenRedrawDispatcher.addEventListener('redrawNeeded', function() {
	GraphicsScreen.refreshTurtle();
	refreshCursor();
});
setInterval(refreshCursor, 30);