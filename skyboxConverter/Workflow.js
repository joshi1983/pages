class Workflow {
	constructor() {
		this.stage = 0;
		this.stages = [
			'Pick Input File and Layout',
			'Pick Output Layout',
			'Export'
		];
		var outer = this;
		var workflowStage = document.getElementById('workflow-stage');
		this.buttons = this.stages.map(function(stage, index) {
			var button = document.createElement('button');
			button.innerText = stage;
			button.addEventListener('click', function() {
				outer.stage = index;
				outer._updateDOM();
			});
			workflowStage.appendChild(button);
			return button;
		});
		this._updateDOM();
	}

	_updateDOM() {
		var outer = this;
		this.buttons.forEach(function(button, index) {
			button.classList.remove('active');
			var modeElement = document.querySelector('.mode-' + index);
			if (index !== outer.stage)
				modeElement.style.display = 'none';
			else
				modeElement.style.display = 'flex';
		});
		this.buttons[this.stage].classList.add('active');
	}

	next() {
		this.stage = Math.min(this.stages.length - 1, this.stage + 1);
		this._updateDOM();
	}
}