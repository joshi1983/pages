# copied from
# https://www.youtube.com/watch?v=1GU3XKP1pQY
from turtle import *
import colorsys as cs
bgcolor('black')
pensize(4)
tracer(0)
h=0
def draw(ang,n):
	circle(5+n,60)
	left(ang)
	circle(5+n,60)
for i in range(500):
	c=cs.hsv_to_rgb(h,1,1)
	h+=0.008
	color(c)
	fillcolor('black')
	begin_fill()
	draw(90,1/2)
	end_fill()
	draw(160,i*1.2)
	penup()
	draw(180,i/2)
	draw(90,i/2)
	pendown()
done()
	