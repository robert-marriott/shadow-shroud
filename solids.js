// ================================================================== //
// solids.js just picks a static color to display for debugging       //
// reasons. It evolved shortly after wanting to turn LED's 'off'      //
// It takes command line arguements and parses them into colors.      //
// ================================================================== //
console.log("[INFO] Picking a static color (solids.js)");
console.log("[INFO] Arguements passed to app.js:");
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
///////////////////////////Setup////////////////////////////////////////
// Import necessary libraries.
var Gpio = require('pigpio').Gpio;
// change these to match your LED GPIO pins :
var ledPins = [14,15,18,17,27,22,25,8,7];
// initialise all the output pins
for (var i = 0; i<ledPins.length; i++) {
 var led = new Gpio(ledPins[i], {mode: Gpio.OUTPUT});
 leds.push(led);
}
/////////////////////////Program///////////////////////////////////////
function setColor(){

}

switch(process.argv[2]) {
    case "off":
        setColor();
        break;
    case "white":
        setColor();
        break;
    case "red":
        setColor();
        break;
    case "green":
        setColor();
        break;
    case "blue":
        setColor();
        break;
    default:
        console.log("[WARN] You specified an unsupported color.")
}
function setColor(){

}
