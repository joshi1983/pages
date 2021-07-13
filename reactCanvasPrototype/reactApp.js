class CanvasPrototype extends React.Component {
	constructor(props) {
		super(props);
		this.state = {'canvasWidth': 100, 'canvasHeight': 100};
	}

	componentDidMount() {
		console.log('componentDidMount called.  canvasWidth = ' + this.state.canvasWidth + ', canvasHeight = ' + this.state.canvasHeight);
        const canvas = this.refs.canvas;
		const box = canvas.getBoundingClientRect();
		const width = Math.round(box.width);
		const height = Math.round(box.height);
		if (width !== this.state.canvasWidth || height !== this.state.canvasHeight) {
			var newState = {
				'canvasWidth': width,
				'canvasHeight': height
			};
			this.setState(newState);
			console.log('Tried setting state to ' + JSON.stringify(newState));
		}
		else {
			console.log('YAY!  We are ready to draw!!!');
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, width, height);
			ctx.strokeStyle = '#000';
			const centre = {'x': width * 0.5, 'y': height * 0.5};
			const len = 10;
			const radius = Math.min(width, height) * 0.5;
			// draw a pattern to show that the resolution is right.
			for (var i = 0; i < len; i++) {
				const angle = i * Math.PI * 2 / len; // angle in radians
				const px = centre.x + radius * Math.cos(angle);
				const py = centre.y + radius * Math.sin(angle);
				ctx.moveTo(centre.x, centre.y);
				ctx.lineTo(px, py);
			}
			ctx.stroke();
		}
    }

	render() {
		console.log('render called.  canvasWidth = ' + this.state.canvasWidth + ', canvasHeight = ' + this.state.canvasHeight);
		return React.createElement('canvas', {
			'key': 'canvas',
			'ref': 'canvas',
			'width': this.state.canvasWidth,
			'height': this.state.canvasHeight
		}, null);
	}
}

document.addEventListener('DOMContentLoaded', function() {
	const canvas = React.createElement(CanvasPrototype, {'key': 'canvas'}, null);
	
	ReactDOM.render(
	  canvas,
	  document.getElementById('root')
	);
});