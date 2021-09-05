# copied from:
# https://www.youtube.com/watch?v=kXM0XNEPG94

import turtle as tur
import colorsys as cs
tur.speed(0)
tur.bgcolor('black')
tur.width(2)
for i in range(180):
	tur.color(cs.hsv_to_rgb(abs(90-i)/90,abs(90-i)/90,1))
	tur.forward(100)
	tur.left(60)
	tur.forward(100)
	tur.right(120)
	tur.circle(50)
	tur.left(240)
	tur.forward(100)
	tur.left(60)
	tur.forward(100)
	tur.left(122)