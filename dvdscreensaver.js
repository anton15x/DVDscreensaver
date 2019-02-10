/* -----------------------------------------------
/* Author : Anton Hinterhofer - anton15x.github.io
/* MIT license: http://opensource.org/licenses/MIT
/* Demowebsite : anton15x.github.io/DVDscreensaver/demo
/* GitHub : github.com/anton15x.github.io/DVDscreensaver
/* How to use? : Check the GitHub README or the demo
/* v0.1.0
/* ----------------------------------------------- */

class dvdscreensaver {
  constructor(animationActive = true, icon = null, width = "15%", startX = 0, startY = 0, speedX = 3, speedY = 2, dirX = '+', dirY = '+') {

    if (icon == null) {
      let img = document.createElement("img");
      //img.src = "./img/DVD-Video_Logo.svg"; //Error if html is not in the same folder as the img folder
      img.src = getRunningScriptPath()+"/img/DVD-Video_Logo.svg";
      this.icon = document.body.appendChild(img);
    } else {
      this.icon = icon;
    }

    this.icon.style.cssText += "position:absolute;"
    this.icon.style.cssText += "width:" + width + ";height:auto;";
    this.icon.style.cssText += "background:transparent;";
    this.icon.style.cssText += "pointer-events: none;";

    this.oldColorNumber = 0;
    this.changeColor();
    this.speedX = speedX;
    this.speedY = speedY;
    this.dirX = dirX;
    this.dirY = dirY;

    this.checkcornerhit = false; //variable to only check cornerhit after wallhit
    this.cornerHits = 0;
    this.wallhits = 0;
    this.animationActive = 0; //this.start() uses this var
    this.stopAnimation = 0;

    this.setX(startX);
    this.setY(startY);

    if (animationActive == true) {
      this.start();
    }

    console.log("dvdscreensaver created");
  }

  changeColor() {
    let newColorNumber = randomIntFromIntervalNoRepeat(0, dvdscreensaver.filterColors.length - 1, this.oldColorNumber);
    this.icon.style.filter = dvdscreensaver.filterColors[newColorNumber];
    this.oldColorNumber = newColorNumber;
  }

  changeWidth(width) {
    this.icon.style.width = width;
    this.icon.style.height = "auto";
  }
  changeHeight(height) {
    this.icon.style.width = "auto";
    this.icon.style.height = height;
  }
  changeSize(width, height) {
    this.icon.style.width = width;
    this.icon.style.height = height;
  }

  changeSpeed(speedX, speedY) {
    this.speedX = speedX;
    this.speedY = speedY;
  }

  changeDir(dirX, dirY) {
    this.dirX = dirX;
    this.dirY = dirY;
  }

  wallHit() {
    dvdscreensaver.wallHitsCount++;
    this.wallhits++;
    dvdlogoStatsUpdate();
    this.checkcornerhit = true;
    this.changeColor();
  }

  checkWallHit(countwallhit = false) {
    let wallhit = false;
    if (this.checkHitTop()) {
      this.dirY = '+';
      this.wallHit(countwallhit);
      wallhit = true;
    }
    if (this.checkHitRight()) {
      this.dirX = '-';
      this.wallHit(countwallhit);
      wallhit = true;
    }
    if (this.checkHitBottom()) {
      this.dirY = '-';
      this.wallHit(countwallhit);
      wallhit = true;
    }
    if (this.checkHitLeft()) {
      this.dirX = '+';
      this.wallHit(countwallhit);
      wallhit = true;
    }
    return wallhit;
  }

  checkHitTop(addvalue = 0, absolutepos = this.getIconY()) {
    //  return this.getIconY()  <= 0;
    return dvdscreensaver.operate[this.dirY](absolutepos, addvalue) <= 0;
  }
  checkHitRight(addvalue = 0, absolutepos = this.getIconX()) {
    //  return this.getIconX()  + this.icon.clientWidth >= this.icon.parentNode.clientWidth;
    return dvdscreensaver.operate[this.dirX](absolutepos, addvalue) + this.icon.clientWidth >= this.icon.parentNode.clientWidth;
  }
  checkHitBottom(addvalue = 0, absolutepos = this.getIconY()) {
    //  return this.getIconY() + this.icon.clientHeight >= this.icon.parentNode.clientHeight;
    return dvdscreensaver.operate[this.dirY](absolutepos, addvalue) + this.icon.clientHeight >= this.icon.parentNode.clientHeight;
  }
  checkHitLeft(addvalue = 0, absolutepos = this.getIconX()) {
    //  return this.getIconX()  <= 0;
    return dvdscreensaver.operate[this.dirX](absolutepos, addvalue) <= 0;
  }

  checkCornerHit() {
    let cornerhit = false;
    if (this.checkcornerhit == true) {
      this.checkcornerhit = false;
      if ((this.checkHitTop() && this.checkHitLeft()) ||
        (this.checkHitTop() && this.checkHitRight()) ||
        (this.checkHitBottom() && this.checkHitLeft()) ||
        (this.checkHitBottom() && this.checkHitRight())
      ) {
        dvdscreensaver.cornerHitCount++;
        this.cornerHits++;
        dvdlogoStatsUpdate();
        cornerhit = true;
      }
    }
    return cornerhit;
  }

  checkHit(countwallhit = false) {
    let hit = this.checkWallHit(countwallhit);
    this.checkCornerHit();
    return hit;
  }

  getIconX() {
    //return this.icon.x; //this method results in false cordinats wjile zooming in browser
    return parseInt(this.icon.style.left, 10);
  }
  getIconY() {
    //return this.icon.y; //this method results in false cordinats wjile zooming in browser
    return parseInt(this.icon.style.top, 10);
  }

  setIcon(xadd = 0, yadd = 0, forcestop = 0, usedefaults = true) {
    let xadd2 = 0,
      yadd2 = 0;
    if (usedefaults) {
      xadd = this.speedX;
      yadd = this.speedY;
    } else {
    //  console.log("add x " + xadd + "!!!, add y " + yadd + "!!!");
    }

    //  console.log("this.icon.parentNode.clientWidth: " + this.icon.parentNode.clientWidth + ", this.icon.parentNode.clientHeight: " + this.icon.parentNode.clientHeight + ", dirX: " + this.dirX + ", dirY: " + this.dirY + ", xadd: " + xadd + ", yadd: " + yadd + ", forcestop: " + forcestop);

    if (this.dirX == '+') {
      if (this.checkHitRight(xadd)) {
        xadd2 = dvdscreensaver.operate[this.dirX](this.getIconX(), xadd) - (this.icon.parentNode.clientWidth - this.icon.clientWidth);
      }
    } else {
      if (this.checkHitLeft(xadd)) {
        xadd2 = -dvdscreensaver.operate[this.dirX](this.getIconX(), xadd);
      }
    }
    this.setX(dvdscreensaver.operate[this.dirX](this.getIconX(), xadd));

    if (this.dirY == '+') {
      if (this.checkHitBottom(yadd)) {
        yadd2 = dvdscreensaver.operate[this.dirY](this.getIconY(), yadd) - (this.icon.parentNode.clientHeight - this.icon.clientHeight);
      }
    } else {
      if (this.checkHitTop(yadd)) {
        yadd2 = -dvdscreensaver.operate[this.dirY](this.getIconY(), yadd);
      }
    }
    //console.log("calc: " + this.getIconY() + " " + this.dirY + " " + yadd + " = " + dvdscreensaver.operate[this.dirY](this.getIconY(), yadd));
    this.setY(dvdscreensaver.operate[this.dirY](this.getIconY(), yadd));

    if (this.checkHit(true)) {
      if (xadd2 != 0 || yadd2 != 0) {
        if (forcestop < 10) {
          this.setIcon(xadd2, yadd2, ++forcestop, false);

        } else {
          console.log("forcestop!!!");
        }
      }
    }
  }

  setX(x) {
    //console.log("set x to: " + x + "px");
    if (this.checkHitRight(0, x)) {
      x = this.icon.parentNode.clientWidth - this.icon.clientWidth;
    }
    if (this.checkHitLeft(0, x)) {
      x = 0;
    }
    //console.log("set corrigated x to: " + x + "px");
    this.icon.style.left = x + 'px';
  }

  setY(y) {
    //console.log("set y to: " + y + "px");
    if (this.checkHitBottom(0, y)) {
      y = (this.icon.parentNode.clientHeight - this.icon.clientHeight);
    }
    if (this.checkHitTop(0, y)) {
      y = 0;
    }
    //console.log("set corrigated y to: " + y + "px");
    this.icon.style.top = y + 'px';
  }

  update() {
    this.setIcon();
    if (this.stopAnimation <= 0) {
      window.requestAnimationFrame(this.update.bind(this));
    } else {
      this.stopAnimation--;
      this.animationActive--;
    }
  }

  start(allowMultiple = false) {
    if (this.animationActive <= 0 || allowMultiple) {
      this.animationActive++;
      window.requestAnimationFrame(this.update.bind(this));
    }
  }

  stop(toKeep = this.animationActive - 1) {
    if (this.animationActive > 0) {
      if (this.animationActive > toKeep) {
        this.stopAnimation = this.animationActive - toKeep;
      }
    }
  }
  getImg(){
    return this.icon;
  }
  setImg(img){
    this.icon=img;
  }
}

dvdscreensaver.cornerHitCount = 0;
dvdscreensaver.wallHitsCount = 0;
dvdscreensaver.printstats = false;
(function() {
  let dvdstats = document.getElementById("dvd-stats");
  if (dvdstats != null) {
    dvdscreensaver.printstats = true;
    dvdstats.style.position = "fixed";
    dvdstats.style.bottom = "0";
    dvdstats.style.left = "0";

    let newDiv = document.createElement("div");
    let newSpan = document.createElement("spann");
    let newContent = document.createTextNode("Cornerhits");
    newSpan.setAttribute('id', 'dvd-cornerhits');
    newSpan.textContent = "0";
    newDiv.appendChild(newSpan);
    newDiv.appendChild(newContent);
    dvdstats.appendChild(newDiv);

    newDiv = document.createElement("div");
    newSpan = document.createElement("spann");
    newContent = document.createTextNode("Wallhits");
    newSpan.setAttribute('id', 'dvd-wallhits');
    newSpan.textContent = "0";
    newDiv.appendChild(newSpan);
    newDiv.appendChild(newContent);
    dvdstats.appendChild(newDiv);
  }
})();

function dvdlogoStatsUpdate() {
  if (dvdscreensaver.printstats) {
    document.getElementById('dvd-wallhits').innerHTML = dvdscreensaver.wallHitsCount;
    document.getElementById('dvd-cornerhits').innerHTML = dvdscreensaver.cornerHitCount;
  }
}

dvdscreensaver.filterColors = [
  "invert(.3) sepia(1) saturate(8) hue-rotate(70deg)", //green
  "invert(.63) sepia(1) saturate(8) hue-rotate(70deg)", //light green
  "invert(.8) sepia(1) saturate(5) hue-rotate(150deg)", //light blue
  "invert(.2) sepia(1) saturate(7) hue-rotate(180deg)", //blue
  "invert(.5) sepia(1) saturate(5) hue-rotate(260deg)", //pink
  "invert(.5) sepia(1) saturate(5) hue-rotate(340deg)", //orange
  "invert(.8) sepia(1) saturate(5) hue-rotate(350deg)", //yellow
];

dvdscreensaver.operate = {
  '+': function(a, b) {
    return a + b
  },
  '-': function(a, b) {
    return a - b
  }
};

function randomIntFromIntervalNoRepeat(min, max, oldnumber) {
  if (typeof randomIntFromIntervalNoRepeat.number == 'undefined') {
    randomIntFromIntervalNoRepeat.number = 0;
  }
  if (typeof oldnumber != 'undefined') {
    randomIntFromIntervalNoRepeat.number = oldnumber;
  }
  let num = randomIntFromInterval(min, max);
  //if the number is the same as the old number, simply increment it:
  if (num == randomIntFromIntervalNoRepeat.number) {
    num++;
  }
  if (num > max) {
    num = 0;
  }
  randomIntFromIntervalNoRepeat.number = num;
  return num;
}


function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//getRunningScript() & getRunningScriptPath(): https://stackoverflow.com/questions/2255689/how-to-get-the-file-path-of-the-currently-executing-javascript-code
function getRunningScript(){
        let err = new Error()
        let link = err.stack.split('(')
        link = link[1]
        link = link.split(')')[0]
        link = link.split(':')
        link.splice(-2, 2)
        link = link.join(':')
        return link
}
function getRunningScriptPath(){
  var script = getRunningScript();
  var path = script.substring(0, script.lastIndexOf('/'));
  return path;
};
