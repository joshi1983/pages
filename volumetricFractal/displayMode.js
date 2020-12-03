class DisplayMode {
	constructor(gl, pid, realtimeRenderer) {
		this.gl = gl;
		this.locationOfDisplayMode = gl.getUniformLocation(pid, "displayMode");
		this.realtimeRenderer = realtimeRenderer;
	}

	setUniform(newDisplayMode) {
		this.gl.uniform1i(this.locationOfDisplayMode, newDisplayMode);
	}

	set(newDisplayMode, forceUpdate) {
	  var currentValue = this.get();
	  if (forceUpdate || currentValue !== newDisplayMode) {
		  if (currentValue !== newDisplayMode) {
			  var input = this.getInputForDisplayMode(newDisplayMode);
			  input.checked = true;

			  if (this.decreaseQuality !== undefined && currentValue === DisplayMode.PLANE_CUT && newDisplayMode !== currentValue) {
				// volumetric rendering can't run at the same quality.
				// prevent the browser from crashing.
				this.decreaseQuality(2);
			  }
		  }
	  }
	  this.setUniform(newDisplayMode);
	  this.realtimeRenderer.redraw();
	}
	
	get() {
	  var input = document.querySelector('[name="display-mode"]:checked');
	  return parseInt(input.value);
	}
	
	isPlaneCut() {
		return this.get() === DisplayMode.PLANE_CUT;
	}
	
	getInputForDisplayMode(displayMode) {
		return document.querySelector('input[name="display-mode"][value="' + displayMode + '"]');
	}

	initSettingsToggler(mandelBrotDisplay, pixelSubsampling) {
		var lightSettings = document.getElementById('light-settings');
		var wideColumn = document.getElementById('wide-column');
		var outer = this;
		
		function displayModeUpdated() {
			if (!outer.isPlaneCut()) {
				pixelSubsampling.useLowestQuality();
			}
			outer.set(outer.get(), true);
			if (outer.get() !== DisplayMode.DEFAULT) {
				wideColumn.setAttribute('class', 'show-plane-cut-settings');
			}
			else {
				wideColumn.setAttribute('class', 'show-light-settings');
			}
			mandelBrotDisplay.planeCutAxisChanged();
		}

		['volume', 'plane-cut', 'max-cut-volume', 'min-cut-volume'].forEach(function(displayModeName) {
			var input = document.getElementById('display-mode-' + displayModeName);
			input.addEventListener('change', displayModeUpdated);
		});
  }
}

DisplayMode.DEFAULT = 1;
DisplayMode.PLANE_CUT = 2;
DisplayMode.MAX_CUT_VOLUME = 3;
DisplayMode.MIN_CUT_VOLUME = 4;
