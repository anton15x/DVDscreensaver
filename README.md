# DVDscreensaver
Bouncing DVD Video Screensaver
Demo: https://anton15x.github.io/DVDscreensaver/demo/minimaldemo.html
Demo2: https://anton15x.github.io/DVDscreensaver/demo/

## Include the script
```html
<script src="bundle/bundle.js"></script>
```
Or developer version
```html
<script src="bundle/bundle.dev.js"></script>
```

## Compile the script
```bash
npm install
# to get bundle.js (minified version)
npm run compile:prod
# to get bundle.dev.js (developer version)
npm run compile
```

### Init DVD Screensaver
```html
<script>
  let dvd = new DvdScreensaver.default();
</script>
```
This will create a new Bouncing DVD Video Logo.

#### Init DVD Screensaver with existing Image
```html
<img src='./img/DVD-Video_Logo.svg' id='dvdlogo' />
<script>
  let dvd = new DvdScreensaver.default( {icon: document.getElementById('dvdlogo'), } );
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

<script src="bundle/bundle.dev.js"></script>
<script>
  let dvd = new DvdScreensaver.default();
</script>
```


## DVD Screensaver Methods

* **changeWidth(width,keepSideRatio=true)**: (string) Sets the width of the image (Height will get calculated to keep the same Side Ratio or changed to auto if keepSideRatio=false).
```js
dvd.changeWidth("20%");
```
* **changeHeight(height,keepSideRatio=true)**: (string) Sets the height of the image (Width will get calculated to keep the same Side Ratio or will get changed to auto if keepSideRatio=false).
```js
dvd.changeHeight("10%");
```
* **changeSize(width, height)**: (string, string) Sets the width and height of the image.
```js
dvd.changeSize("25%", "15%");
```
* **getWidth(split=false)**: (string) Returns the width of the image.
```js
let width = dvd.getWidth();     //"25%"
let width = dvd.getWidth(true); //["25", "%"]
```
* **getHeight(split=false)**: (string) Returns the height of the image.
```js
let height = dvd.getHeight();     //"15%"
let height = dvd.getHeight(true); //["15", "%"]
```
* **changeSpeed(speedX, speedY)**: (int, int) Changes the speedX and speedY variables.
```js
dvd.changeSpeed(5,3);
```
* **changeDir(dirX, dirY)**: (string, string) Changes the dirX and dirY variables.
```js
dvd.changeDir('+','+');
```
* **setX(x)**: (int) Set the X-Coordinate of the image (only the the visible area).
```js
dvd.setX(250);
```
* **setY(y)**: (int) Set the Y-Coordinate of the image (only the the visible area).
```js
dvd.setY(150);
```
* **setXY(x,y)**: (int, int) Set the X- and Y-Coordinate of the image (only the the visible area).
```js
dvd.setY(50, 20);
```
* **start(allowMultiple = false)**: (boolean) [default false] Starts the animation, with true a new window.requestAnimationFrame will start.
```js
dvd.start();
```
* **stop(toKeep = this.animationActive - 1)**: (int) [default this.animationActive - 1 (=>will stop one animation)] Stops one animation (the remaining amout of window.requestAnimationFrame can be chosen)
```js
dvd.stop();
```
* **getImg()**: () Get the bouncing Image element.
```js
let img = dvd.getImg();
```
* **setImg(img)**: (element) Sets the bouncing Image.
```js
dvd.setImg(img);
```

## DVD Screensaver Default Parameters
```js
let dvd = new DvdScreensaver.default({
                               icon: null,
                               animationActive: true,
                               addstyle: true,
                               changecolor: true,
                               iconParent: document.body,
                               width: "15%",
                               startX: 0,
                               startY: 0,
                               speedX: 3,
                               speedY: 2,
                               dirX: '+',
                               dirY: '+'
							 }
                             );
```

 * **options**: (object)
   * **icon**: (element) [default null] Specifies the img element that should bounce. If null, one is created in the body element
   * **animationActive**: (boolean) [default true] Starts the animation if true.
   * **addstyle**: (boolean) [default true] Add style tags to image if true.
   * **changecolor**: (boolean) [default true] Changes the color on wallhit if true.
   * **iconParent**: (element) [default document.body] Where to create the icon, if no icon specified.
   * **width**: (string) [default "15%"] The width of the image (various css units possible).
   * **startX**: (int) [default 0] X-Coordinate to start.
   * **startY**: (int) [default 0] Y-Coordinate to start.
   * **speedX**: (int) [default 3] Moving pixels in x-Coordinate during at Frame.
   * **speedY**: (int) [default 2] Moving pixels in y-Coordinate during at Frame.
   * **dirX**: (string) [default '+'] Starting X-Direction.
   * **dirY**: (string) [default '-'] Starting Y-Direction.

## Source of the image used:
DVD Logo: https://commons.wikimedia.org/wiki/File:DVD_logo.svg<br/>
DVD Video Logo: https://commons.wikimedia.org/wiki/File:DVD-Video_Logo.svg
