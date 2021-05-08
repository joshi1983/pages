
function BurningShip() {
    var self = this;

    self.name = 'Burning Ship';

    self.getValueAt = function(x, y) {
        var xt;
        var zx = 0, zy = 0;
        var cy = y;
        var cx = x;
		var i = 0;

        for (; i < 255 && zx*zx + zy*zy < 4.0; i++) {
			xt = zx*zx - zy*zy + x; 
			zy = Math.abs(2.0*zx*zy) + y;
			zx = xt;
        }

        return i;
    };
}
