
function MandelbrotSet() {
    var self = this;
    
    self.name = 'Mandelbrot Set';
    
    self.getValueAt = function(x, y) {
        var xt;
        var zx = 0, zy = 0;
        var cy = y;
        var cx = x;

        for (var i = 0; i < 255 && zx < 2; i++) {
            xt = zx * zy;
            zx = zx * zx - zy * zy + cx;
            zy = 2 * xt + cy;
        }

        return i;
    };
}
