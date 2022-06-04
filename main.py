speedFactor = 80
pin_L = DigitalPin.P13
pin_R = DigitalPin.P14
whiteline = 1
connected = 0
strip = neopixel.create(DigitalPin.P16, 4, NeoPixelMode.RGB)
pins.set_pull(pin_L, PinPullMode.PULL_NONE)
pins.set_pull(pin_R, PinPullMode.PULL_NONE)
bluetooth.start_uart_service()
basic.show_string("S")

# temporary code
#strip.set_pixel_color(0, neopixel.hsl(0, 50, 50)) # hmax = 360, smax = 100, lmax = 50
#strip.set_pixel_color(3, neopixel.hsl(140, 100, 25))
#strip.show()
# end of temporary code
def on_button_pressed_a():
    pin_L = pins.digital_read_pin(DigitalPin.P13)
    pin_R = pins.digital_read_pin(DigitalPin.P14)
    console.log(pin_L)
    console.log(pin_R)
input.on_button_pressed(Button.A, on_button_pressed_a)
def motor_run(left = 0, right = 0, speed_factor = 80):
    PCAmotor.motor_run(PCAmotor.Motors.M1, Math.map(Math.constrain(left * (speedFactor / 100), -100, 100), -100, 100, -255, 255))
    PCAmotor.motor_run(PCAmotor.Motors.M4, Math.map(Math.constrain(right * (speedFactor / 100), -100, 100), -100, 100, -255, 255))

def on_bluetooth_connected():
    global connected
    basic.show_icon(IconNames.HEART)
    connected = 1
    while connected == 1:
        uartData = bluetooth.uart_read_until(serial.delimiters(Delimiters.HASH))
        console.log_value("data", uartData)
        if uartData == "A":
            motor_run(100, 100, 100)
        elif uartData == "B":
            motor_run(-100, -100, -100)
        elif uartData == "C":
            motor_run(40, 100, 100)
        elif uartData == "D":
            motor_run(100, 40, 100)
        elif uartData == "0":
            PCAmotor.motor_stop_all()

bluetooth.on_bluetooth_connected(on_bluetooth_connected)

def on_bluetooth_disconnected():
    global connected
    basic.show_icon(IconNames.SAD)
    connected = 0
bluetooth.on_bluetooth_disconnected(on_bluetooth_disconnected)