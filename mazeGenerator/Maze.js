class Maze {
	constructor(cells, startPoint, endPoint) {
		if (!(cells instanceof Array))
			throw new Error('Maze cells must be an Array.');
		if (!(startPoint instanceof PerimeterPoint))
			throw new Error('Maze startPoint must be a PerimeterPoint');
		if (!(endPoint instanceof PerimeterPoint))
			throw new Error('Maze endPoint must be a PerimeterPoint');
		this.canvas = document.querySelector('canvas');
		this.cells = cells;
		this.startPoint = startPoint;
		this.endPoint = endPoint;
	}

	clearVisited() {
		for (var x = 0; x < this.cells.length; x++) {
			for (var y = 0; y < this.cells[x].length; y++) {
				this.cells[x][y].setVisited(false);
			}
		}
	}

	setSize(width, height) {
		this.cells = Maze.getCells(width, height);
		this.endPoint = new PerimeterPoint(width - 1, height - 1);
	}

	_cellToPixels(p, left, top, pixelsPerCell) {
		return {
			'x': left + (p.x + 0.5) * pixelsPerCell,
			'y': top + (p.y + 0.5) * pixelsPerCell
		};
	}

	_drawSolution(g, left, top, pixelsPerCell) {
		var solutionPath = MazeSolver.solve(this);
		g.strokeStyle = '#08d';
		g.beginPath();
		var previousPoint = {'x': this.startPoint.x, 'y': this.startPoint.y};
		var p = this._cellToPixels(this.startPoint, left, top, pixelsPerCell);
		g.moveTo(p.x, p.y);
		var outer = this;
		solutionPath.forEach(function(point) {
			p = outer._cellToPixels(point, left, top, pixelsPerCell);
			g.lineTo(p.x, p.y);
		});
		g.stroke();
	}

	draw(isSolutionVisible) {
		var w = this.canvas.getAttribute('width');
		var h = this.canvas.getAttribute('height');
		var g = this.canvas.getContext('2d');
		var aspectRatio = w / h;
		var borderSize = 0.03;
		var marginSize = 0.03;
		var totalSpace = marginSize + borderSize;
		var mazeCellWidth = this.cells.length;
		var mazeCellHeight = this.cells[0].length;
		var mazeCellAspectRatio = mazeCellWidth / mazeCellHeight;
		var pixelsPerCell;
		if (aspectRatio < mazeCellAspectRatio) {
			pixelsPerCell = Math.floor(w / (mazeCellWidth * (1 + totalSpace)));
		}
		else {
			pixelsPerCell = Math.floor(h / (mazeCellHeight * (1 + totalSpace)));
		}
		var thickness = Math.ceil(pixelsPerCell * 0.03);
		var mazeWidth = mazeCellWidth * pixelsPerCell;
		var mazeHeight = mazeCellHeight * pixelsPerCell;
		var left = Math.floor((w - mazeWidth) * 0.5);
		var top = Math.floor((h - mazeHeight) * 0.5);

		g.clearRect(0, 0, w, h);
		
		g.fillStyle = '#fff';
		g.fillRect(left, top, mazeWidth, mazeHeight);
		g.fill();

		// draw the border.
		g.strokeStyle = '#ddd';
		g.lineWidth = 5 * thickness;
		g.beginPath();
		g.rect(left, top, mazeWidth, mazeHeight);
		g.stroke();
		
		g.strokeStyle = '#000';
		g.lineWidth = thickness;
		g.beginPath();
		
		g.rect(left, top, mazeWidth, mazeHeight);
		
		// loop through cells.
		for (var x = 0; x < this.cells.length; x++) {
			for (var y = 0; y < this.cells[x].length; y++) {
				this.cells[x][y].draw(g, left + x * pixelsPerCell, top + y * pixelsPerCell, pixelsPerCell);
			}
		}
		g.stroke();
		g.strokeStyle = '#f00';
		g.beginPath();
		// draw the start and end points.
		this.startPoint.draw(g, left, top, pixelsPerCell);
		g.strokeStyle = '#080';
		g.beginPath();
		this.endPoint.draw(g, left, top, pixelsPerCell);
		
		if (isSolutionVisible) {
			this._drawSolution(g, left, top, pixelsPerCell);
		}
	}
}

Maze.getCells = function(cellsWide, cellsHigh) {
	var cells = [];
	for (var x = 0; x < cellsWide; x++) {
		var column = [];
		for (var y = 0; y < cellsHigh; y++) {
			column.push(new MazeCell(true, true));
		}
		cells.push(column);
	}
	return cells;
};

Maze.createEmpty = function(cellsWide, cellsHigh) {
	var cells = Maze.getCells(cellsWide, cellsHigh);
	var startPoint = new PerimeterPoint(0, 0);
	var endPoint = new PerimeterPoint(cellsWide - 1, cellsHigh - 1);
	return new Maze(cells, startPoint, endPoint);
};