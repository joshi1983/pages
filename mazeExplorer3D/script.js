document.addEventListener('DOMContentLoaded', function() {
	var renderer = new Renderer();
	var isShowingWire = false;
	var wireRenderer = new WireframeRenderer(renderer);
	var mainCharacter = new MainCharacter(renderer);
	
	function toggleRenderMode() {
		isShowingWire = !isShowingWire;
		if (isShowingWire)
			wireRenderer.activate();
		else
			wireRenderer.deactivate();
	}
	
	setUpDragUI(renderer);
	//toggleRenderMode();
	//setInterval(toggleRenderMode, 4000);
});