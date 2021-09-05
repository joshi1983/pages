# copied from:
# https://www.youtube.com/watch?v=3FFh9zQSLAk
import turtle
turtle.speed(0)
turtle.bgcolor("black")
turtle.color("orange")
turtle.hideturtle()
m=1
n=True

while True:
	turtle.circle(m)
	if n:
		m=m-1
	else:
		m=m+1
	if m==0 or m==60:
		n=not n
	turtle.left(1)
	turtle.forward(3)