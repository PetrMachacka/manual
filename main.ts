let speedFactor = 80
let pin_L = DigitalPin.P13
let pin_R = DigitalPin.P14
let whiteline = 1
let connected = 0
let strip = neopixel.create(DigitalPin.P16, 4, NeoPixelMode.RGB)
pins.setPull(pin_L, PinPullMode.PullNone)
pins.setPull(pin_R, PinPullMode.PullNone)
bluetooth.startUartService()
basic.showString("S")
//  temporary code
// strip.set_pixel_color(0, neopixel.hsl(0, 50, 50)) # hmax = 360, smax = 100, lmax = 50
// strip.set_pixel_color(3, neopixel.hsl(140, 100, 25))
// strip.show()
//  end of temporary code
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    let pin_L = pins.digitalReadPin(DigitalPin.P13)
    let pin_R = pins.digitalReadPin(DigitalPin.P14)
    console.log(pin_L)
    console.log(pin_R)
})
function motor_run(left: number = 0, right: number = 0, speed_factor: number = 80) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, Math.map(Math.constrain(left * (speedFactor / 100), -100, 100), -100, 100, -255, 255))
    PCAmotor.MotorRun(PCAmotor.Motors.M4, Math.map(Math.constrain(right * (speedFactor / 100), -100, 100), -100, 100, -255, 255))
}

bluetooth.onBluetoothConnected(function on_bluetooth_connected() {
    let uartData: string;
    
    basic.showIcon(IconNames.Heart)
    connected = 1
    while (connected == 1) {
        uartData = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Hash))
        console.logValue("data", uartData)
        if (uartData == "A") {
            motor_run(100, 100, 100)
        } else if (uartData == "B") {
            motor_run(-100, -100, -100)
        } else if (uartData == "C") {
            motor_run(40, 100, 100)
        } else if (uartData == "D") {
            motor_run(100, 40, 100)
        } else if (uartData == "0") {
            PCAmotor.MotorStopAll()
        }
        
    }
})
bluetooth.onBluetoothDisconnected(function on_bluetooth_disconnected() {
    
    basic.showIcon(IconNames.Sad)
    connected = 0
})
