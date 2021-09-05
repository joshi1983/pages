# copied from:
# https://www.youtube.com/shorts/dgcfl71moDE
from turtle import *
from colorsys import *
import math

tracer(50)
bgcolor('black')
h = 0

penup()
for i in range(900):
	ang = i * 137.5 * (math.pi / 180)
	rad = 6 * math.sqrt(i)
	x = rad * math.cos(ang)
	y = rad * math.sin(ang)
	color(hsv_to_rgb(h, 1, 1))
	h = (h + 0.002) % 1
	goto(x, y)
	dot( 6 + i / 150)

hideturtle()
done()