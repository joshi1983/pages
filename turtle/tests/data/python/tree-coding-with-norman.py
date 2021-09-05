# copied from:
# https://www.youtube.com/watch?v=SjE2gJd43JE
# The video is from a channel named CodingWithNorman.
# The channel is at https://www.youtube.com/@codingwithnoman
import turtle
t=turtle.Turtle()
t.screen.bgcolor("black")
t.pensize(3)
t.color("green")
t.left(90)
t.backward(180)
t.speed(300)
t.shape('turtle')

def tree(i):
	if i<15:
		return
	else:
		t.forward(i)
		t.color("green")
		t.circle(2)
		t.left(30)
		tree(3* i/4)
		t.right(60)
		tree(3* i/4)
		t.left(30)
		t.backward(i)
tree(100)
turtle.done()