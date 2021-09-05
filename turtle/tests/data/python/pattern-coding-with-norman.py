# copied from:
# https://www.youtube.com/watch?v=RcGRq000KRI
# This is from a channel named CodingWithNorman.
# The channel is at:
# https://www.youtube.com/@codingwithnoman
from turtle import *
import colorsys
tracer(2)
pensize(2)
h=0.2
bgcolor("black")
lt(80)
fd(250)
lt(180)
lt(80)
for i in range(330):
	c=colorsys.hsv_to_rgb(h,1,1)
	color(c)
	h+=0.004
	fd(i)
	rt(50)
	rt(40)
	fd(500)
	rt(120)
done()