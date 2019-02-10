# DVDscreensaver
Bouncing DVD Video Screensaver

## Include the script
```html
<script src="js/dvdscreensaver.js"></script>
```

### Init DVD Screensaver
```html
<script>
  let dvd = new dvdscreensaver();
</script>
```
This will create a new Bouncing DVD Video Logo.

#### Init DVD Screensaver with existing Image
```html
<img src='./img/DVD-Video_Logo.svg' id='dvdlogo' />
<script>
  let dvd = new dvdscreensaver(true, document.getElementById('dvdlogo');
</script>
```
This will create a new Bouncing DVD Video Logo with the selected Image.

## Statistics
```html
<div id="dvd-stats"></div>
```
This will show the statistics of the bouncing DVD Logos in the bottom left corner.

## Minimized Example of one bouncing DVD Logo
```html
<!DOCTYPE HTML>
<style>
  body {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }
</style>

<div id="dvd-stats"></div>

<script src="js/dvdscreensaver.js"></script>
<script>
  let dvd = new dvdscreensaver();
</script>
```


## DVD Screensaver Methods

* **changeWidth(width)**: (string) Sets the width of the image (Height will get changed to auto).
```js
dvd.changeWidth("20%");
```
* **changeHeight(height)**: (string) Sets the height of the image (Width will get changed to auto).
```js
dvd.changeHeight("10%");
```
* **changeSize(width, height)**: (string, string) Sets the width and height of the image.
```js
dvd.changeSize("25%", "15%");
```
* **changeSpeed(speedX, speedY)**: (int, int) Changes the speedX and speedY variables.
```js
dvd.changeSpeed(5,3);
```
* **changeDir(dirX, dirY)**: (string, string) Changes the dirX and dirY variables.
```js
dvd.changeDir('+','+');
```
* **setX(x)**: (int) Set the X-Cordinade of the image (only th the visible area).
```js
dvd.setX(250);
```
* **setY(y)**: (int) Set the Y-Cordinade of the image (only th the visible area).
```js
dvd.setY(150);
```
* **start(allowMultiple = false)**: (boolean) [default false] Starts the animation, with true a new window.requestAnimationFrame will start.
```js
dvd.start();
```
* **stop(toKeep = this.animationActive - 1)**: (int) [default this.animationActive - 1 (=>will stop one animation)] Stops one animation (the remaining amout of window.requestAnimationFrame can be choosen)
```js
dvd.stop();
```
* **getImg()**: () Get the bouncing Image element.
```js
dvd.getImg();
```
* **setImg(img)**: (element) Sets the bouncing Image.
```js
dvd.setImg(img);
```

## DVD Screensaver Default Parameters
```js
let dvd = new dvdscreensaver(animationActive = true, 
                             icon = null, 
                             width = "15%", 
                             startX = 0, 
							 startY = 0, 
                             speedX = 3, 
							 speedY = 2, 
                             dirX = '+', 
							 dirY = '+');
```

 * **animationActive**: (boolean) [default true] Starts the animation if true.
 * **icon**: (element) [default null] Specifies the img element that should bounce. If null, one is created in the body element
 * **width**: (string) [default "15%"] The width of the image (various css units possible).
 * **startX**: (int) [default 0] X-Cordinade to start.
 * **startY**: (int) [default 0] Y-Cordinade to start.
 * **speedX**: (int) [default 3] Moving pixels in x-Cordinade during at Frame.
 * **speedY**: (int) [default 2] Moving pixels in y-Cordinade during at Frame.
 * **dirX**: (string) [default '+'] Starting X-Direction.
 * **dirY**: (string) [default '-'] Starting Y-Direction.

## Source of the image used:
DVD Logo: https://commons.wikimedia.org/wiki/File:DVD_logo.svg
DVD Video Logo: https://commons.wikimedia.org/wiki/File:DVD-Video_Logo.svg

