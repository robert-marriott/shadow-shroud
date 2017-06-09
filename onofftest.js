var Gpio = require('onoff').Gpio;

var btns[0] = new Gpio(24, 'in', 'rising', { persistentWatch: true, debounceTimeout: 1000 });
var btns[1] = new Gpio(3,  'in', 'rising', { persistentWatch: true, debounceTimeout: 1000 });
var btns[2] = new Gpio(4,  'in', 'rising', { persistentWatch: true, debounceTimeout: 1000 });

btns[0].watch(function (err, value) {
    if (err) {
        throw err;
    } else {
      console.log("Button 1 pressed");
    }
});

btns[1].watch(function (err, value) {
    if (err) {
        throw err;
    } else {
      console.log("Button 2 pressed");
    }
});

btns[2].watch(function (err, value) {
    if (err) {
        throw err;
    } else {
      console.log("Button 3 pressed");
    }
});
