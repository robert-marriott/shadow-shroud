# shadow-shroud
Electronics to control the shadow shroud art piece

## Libraries
* https://www.npmjs.com/package/player
* https://www.npmjs.com/package/pigpio

## Information and examples
* https://learn.adafruit.com/node-embedded-development/events

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

5. 
