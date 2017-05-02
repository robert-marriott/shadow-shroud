// ================================================================== //
// This is the base of the shadow shroud project. It runs a NodeJS    //
// backend that listens for input, and plays selected MP3's upon      //
// a button trigger. It will also modulate LED's.                     //
// ================================================================== //
console.log("[INFO] Starting app.js");

//var player = require('player'); //mp3 player library
var _      = require('lodash'); //Useful general utils
var noble  = require('noble') //BT central server library

// probably need noble packages for BT central module
// also a web front end in AP mode to administer/pair

// onoff - for gpio
// node-gpio - library for pin comms on pi zero w
//
// structure: songs.js will use the player library and affiliate songs
//            with calls. imported into this file for use in a switch
//            for button presses.

function playSong(songName){
console.log("variable working");

}
