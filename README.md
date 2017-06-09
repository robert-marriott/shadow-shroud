# shadow-shroud
Electronics to control the shadow shroud art piece

## Libraries
* https://www.npmjs.com/package/player
* https://www.npmjs.com/package/pigpio -> use and manipulation of GPIO pins on RPi 2011 1.1
* https://www.npmjs.com/package/node-omxplayer -> create mp3 objects to play on native player.
* https://www.npmjs.com/package/lodash -> lodash has a software debounce function

## Information and examples
* https://learn.adafruit.com/node-embedded-development/events
* https://raspberrypi.stackexchange.com/questions/37957/can-i-use-any-gpio-pin-as-an-input
  * Issues using I2C pins as input pins. Didn't respond, caused other issues.

## Steps to reproduce:
1. Install newest raspbian/NOOBS onto SD card
2. Setup hostname, keyboard pref, OC, boot to GUI/cli
3. Install wifi driver if needed.

```
sudo wget http://www.fars-robotics.net/install-wifi -O /usr/bin/install-wifi
sudo chmod +x /usr/bin/install-wifi
sudo install-wifi -c 8188eu
sudo update-rpi (or something)
```

4. Install audio driver.
```
sudo apt-get install alsa-utils mpg123
```

5. Install pigpio
```
something
```

6. Install omxplayer
```
sudo apt-get install omxplayer
```
