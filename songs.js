// ================================================================== //
//                             Songs.js                               //
// Generates lists and object collections so mp3's can be played      //
// in the main program with less visual clutter                       //
// ================================================================== //
const fs = require('fs');
const buttonFolder = './songs/buttons/';
const songsFolder = './songs/bank/';

var songNames = [];
var mandNames = [];

//Import song bank for use in the main program's danceParty state
fs.readdir(songsFolder, (err, files) => {
  files.forEach(file => {
    var song = file;
    songNames.push(song);
  });
});

//Import functional button sounds for use in the main program
fs.readdir(buttonFolder, (err, files) => {
  files.forEach(file => {
    mandNames.push(file);
  });
});

setTimeout(function(){
  console.log("Available songs in dance party song bank: ")
  console.log(songNames);
  console.log("Available songs in button press prerequisites: ")
  console.log(mandNames);
},2000)
