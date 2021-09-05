import turtle

win = turtle.getscreen()
impostor = turtle.Turtle()
win.setup(width=600, height=600)

glass_color = '#9acedc'


# it can move forward backward left right
def body():
    """ draws the body """
    # right side
    impostor.right(90)
    impostor.forward(50)
    impostor.right(180)
    impostor.circle(40, -180)
    #impostor.right(180)
    #impostor.forward(200)

body()

turtle.done()