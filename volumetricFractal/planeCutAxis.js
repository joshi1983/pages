class PlaneCutAxis {
	constructor(gl, pid) {
		this.gl = gl;
		this.locationOfPlaneCutAxis = gl.getUniformLocation(pid, "planeCutAxis");
		var outer = this;
		['x', 'y', 'z'].forEach(function(axisName) {
			var planeCutAxis = document.getElementById('plane-cut-axis-' + axisName);
			planeCutAxis.addEventListener('change', function() {
				outer.changed();
			});
		});
	}

	setMandelBrotDisplay(mandelBrotDisplay) {
		this.mandelBrotDisplay = mandelBrotDisplay;
		this.changed();
	}

	get() {
		var checkedPlaneCutAxisInput = document.querySelector('[name="plane-cut-axis"]:checked');
		return parseInt(checkedPlaneCutAxisInput.value);
	}

	set(newPlaneCutAxis, forceUpdate) {
		var val = this.get();
		if (forceUpdate || val !== newPlaneCutAxis) {
			if (val !== newPlaneCutAxis) {
				var planeCutAxisInput = document.querySelector('[name="plane-cut-axis"][value="' + newPlaneCutAxis + '"]');
				planeCutAxisInput.checked = true;
			}
			this.gl.uniform1i(this.locationOfPlaneCutAxis, newPlaneCutAxis);
			if (this.mandelBrotDisplay !== undefined)
				this.mandelBrotDisplay.planeCutAxisChanged();
		}
	}
	
	changed() {
		this.set(this.get(), true);
	}
}