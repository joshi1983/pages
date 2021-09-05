# coped from:
# https://www.youtube.com/watch?v=JQPUS1nv5F8&t=19s
import turtle

ob = turtle.Turtle()
ob.speed(0)

cl = ["red", "green", "blue"]

def drawArt(d,angle,x,y):
	c = 0
	ob.up()
	ob.goto(x,y)
	ob.down()
	for i in range(1,400):
		ob.pencolor(cl[c])
		ob.forward(d)
		ob.left(angle)
		d = d - 1
		c = c + 1
		if(c>2):
			c = 0

drawArt(150,98,0,0)