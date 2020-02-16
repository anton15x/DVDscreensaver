import DVDVideoLogoSvgCode from '../img/DVD-Video_Logo.svg';

type Direction = '+'|'-';

export default class DvdScreensaver {
  private icon: any; // HTMLElement; // HTMLElements makes much errors currently => any (for now)
  private animationActive: number;
  private stopAnimation: number;
  private oldColorNumber: number;
  private checkcornerhit: boolean;

  private speedX: number;
  private speedY: number;

  private dirX: Direction;
  private dirY: Direction;

  /**
   * Counters (nor read jet)
   */
  private cornerHits: number;
  private wallhits: number;

  private hitTop: boolean;
  private hitRight: boolean;
  private hitBottom: boolean;
  private hitLeft: boolean;

  constructor(options: any = {}) {

    if (typeof options.icon === 'undefined') {
      options.icon = null;
    }
    if (typeof options.animationActive === 'undefined') {
      options.animationActive = true;
    }
    if (typeof options.addstyle === 'undefined') {
      options.addstyle = true;
    }
    if (typeof options.changecolor === 'undefined') {
      options.changecolor = true;
    }
    if (typeof options.iconParent === 'undefined') {
      options.iconParent = document.body;
    }
    if (typeof options.width === 'undefined') {
      options.width = '15%';
    }
    if (typeof options.startX === 'undefined') {
      options.startX = 0;
    }
    if (typeof options.startY === 'undefined') {
      options.startY = 0;
    }
    if (typeof options.speedX === 'undefined') {
      options.speedX = 3;
    }
    if (typeof options.speedY === 'undefined') {
      options.speedY = 2;
    }
    if (typeof options.dirX === 'undefined') {
      options.dirX = '+';
    }
    if (typeof options.dirY === 'undefined') {
      options.dirY = '+';
    }

    if (options.icon == null) {
      const img = document.createElement('img');
      img.src = DVDVideoLogoSvgCode;
      this.icon = options.iconParent.appendChild(img);
    } else {
      this.icon = options.icon;
    }

    if (this.icon.parentNode.isEqualNode(document.body)) {
      this.icon.style.position = 'fixed';
    } else {
      this.icon.style.position = 'absolute';
    }

    if (options.addstyle) {
      this.changeWidth(options.width, false);
      this.icon.style.background = 'transparent';
      this.icon.style.cssText += 'pointer-events: none;';
      this.icon.style.cssText += 'user-select: none;';
    }

    this.oldColorNumber = 0;
    if (options.changecolor === false) {
      this.oldColorNumber = -1;
    }
    this.changeColor();
    this.speedX = options.speedX;
    this.speedY = options.speedY;
    this.dirX = options.dirX;
    this.dirY = options.dirY;

    this.checkcornerhit = false; // variable to only check cornerhit after wallhit
    this.cornerHits = 0;
    this.wallhits = 0;
    this.animationActive = 0; // this.start() uses this var
    this.stopAnimation = 0;

    this.hitTop = false;
    this.hitRight = false;
    this.hitBottom = false;
    this.hitLeft = false;

    // this.icon.style.top="0px";
    // this.icon.style.left="0px";
    this.setX(options.startX);
    this.setY(options.startY);
    // this.left=options.startX;
    // this.top=options.startY;

    if (options.animationActive) {
      this.start();
    }

    console.log('DvdScreensaver created');
  }

  private changeColor() {
    if (this.oldColorNumber > -1) {
      const newColorNumber = randomIntFromIntervalNoRepeat(
        0, DvdScreensaver.filterColors.length - 1, this.oldColorNumber,
      );
      this.icon.style.filter = DvdScreensaver.filterColors[newColorNumber];
      this.oldColorNumber = newColorNumber;
    }
  }

  changeWidth(width: number, keepSideRatio = true) {
    if (keepSideRatio) {
      this.icon.style.height = this.icon.style.height / this.icon.style.width * width;
    } else {
      this.icon.style.height = 'auto';
    }
    this.icon.style.width = width;
  }

  getWidth(split = false): any {
    if (split) {
      return splitNumberUnit(this.getWidth(false));
    }
    return this.icon.style.width;
  }

  changeHeight(height: number, keepSideRatio = true) {
    if (keepSideRatio) {
      this.icon.style.width = this.icon.style.width / this.icon.style.height * height;
    } else {
      this.icon.style.width = 'auto';
    }
    this.icon.style.height = height;
  }

  getHeight(split = false): any {
    if (split) {
      return splitNumberUnit(this.getHeight(false));
    } else {
      return this.icon.style.height;
    }
  }

  changeSize(width: number, height: number) {
    this.icon.style.width = width;
    this.icon.style.height = height;
  }

  changeSpeed(speedX: number, speedY: number) {
    this.speedX = speedX;
    this.speedY = speedY;
  }

  changeDir(dirX: Direction, dirY: Direction) {
    this.dirX = dirX;
    this.dirY = dirY;
  }

  wallHit(countwallhit: boolean) {
    DvdScreensaver.wallHitsCount++;
    this.wallhits++;
    dvdlogoStatsUpdate();
    this.checkcornerhit = true;
    this.changeColor();
  }

  checkWallHit(countwallhit = false) {
    let wallhit = false;
    if (this.hitTop || this.checkHitTop()) {
      this.hitTop = false;
      this.dirY = '+';
      this.wallHit(countwallhit);
      wallhit = true;
    }
    if (this.hitRight || this.checkHitRight()) {
      this.hitRight = false;
      this.dirX = '-';
      this.wallHit(countwallhit);
      wallhit = true;
    }
    if (this.hitBottom || this.checkHitBottom()) {
      this.hitBottom = false;
      this.dirY = '-';
      this.wallHit(countwallhit);
      wallhit = true;
    }
    if (this.hitLeft || this.checkHitLeft()) {
      this.hitLeft = false;
      this.dirX = '+';
      this.wallHit(countwallhit);
      wallhit = true;
    }
    return wallhit;
  }

  checkHitTop(addvalue = 0, absolutepos = this.getIconY()) {
    //  return this.getIconY()  <= 0;
    return DvdScreensaver.operate[this.dirY](absolutepos, addvalue) <= 0;
  }

  checkHitRight(addvalue = 0, absolutepos = this.getIconX()) {
    //  return this.getIconX()  + this.icon.clientWidth >= this.icon.parentNode.clientWidth;
    return DvdScreensaver.operate[this.dirX](absolutepos, addvalue) +
    this.icon.clientWidth >= this.icon.parentNode.clientWidth;
  }

  checkHitBottom(addvalue = 0, absolutepos = this.getIconY()) {
    //  return this.getIconY() + this.icon.clientHeight >= this.icon.parentNode.clientHeight;
    return DvdScreensaver.operate[this.dirY](absolutepos, addvalue) +
    this.icon.clientHeight >= this.icon.parentNode.clientHeight;
  }

  checkHitLeft(addvalue = 0, absolutepos = this.getIconX()) {
    //  return this.getIconX()  <= 0;
    return DvdScreensaver.operate[this.dirX](absolutepos, addvalue) <= 0;
  }

  checkCornerHit() {
    let cornerhit = false;
    if (this.checkcornerhit) {
      this.checkcornerhit = false;
      if ((this.checkHitTop() && this.checkHitLeft()) ||
        (this.checkHitTop() && this.checkHitRight()) ||
        (this.checkHitBottom() && this.checkHitLeft()) ||
        (this.checkHitBottom() && this.checkHitRight())
      ) {
        DvdScreensaver.cornerHitCount++;
        this.cornerHits++;
        dvdlogoStatsUpdate();
        cornerhit = true;
      }
    }
    return cornerhit;
  }

  checkHit(countwallhit = false) {
    const hit = this.checkWallHit(countwallhit);
    this.checkCornerHit();
    return hit;
  }

  getIconX() {
    // return this.icon.x; //this method results in false cordinats wjile zooming in browser
    return parseInt(this.icon.style.left, 10);
  }
  getIconY() {
    // return this.icon.y; //this method results in false cordinats wjile zooming in browser
    return parseInt(this.icon.style.top, 10);
  }

  setIcon(xadd = 0, yadd = 0, forcestop = 0, usedefaults = true) {
    let xadd2 = 0;
    let yadd2 = 0;
    if (usedefaults) {
      xadd = this.speedX;
      yadd = this.speedY;
    } else {
      //  console.log("add x " + xadd + "!!!, add y " + yadd + "!!!");
    }

    if (this.dirX === '+') {
      if (this.checkHitRight(xadd)) {
        xadd2 = DvdScreensaver.operate[this.dirX](this.getIconX(), xadd) -
        (this.icon.parentNode.clientWidth - this.icon.clientWidth);
      }
    } else {
      if (this.checkHitLeft(xadd)) {
        xadd2 = -DvdScreensaver.operate[this.dirX](this.getIconX(), xadd);
      }
    }
    this.setX(DvdScreensaver.operate[this.dirX](this.getIconX(), xadd));

    if (this.dirY === '+') {
      if (this.checkHitBottom(yadd)) {
        yadd2 = DvdScreensaver.operate[this.dirY](this.getIconY(), yadd) -
        (this.icon.parentNode.clientHeight - this.icon.clientHeight);
      }
    } else {
      if (this.checkHitTop(yadd)) {
        yadd2 = -DvdScreensaver.operate[this.dirY](this.getIconY(), yadd);
      }
    }
    this.setY(DvdScreensaver.operate[this.dirY](this.getIconY(), yadd));

    if (this.checkHit(true)) {
      if (xadd2 !== 0 || yadd2 !== 0) {
        if (forcestop < 10) {
          this.setIcon(xadd2, yadd2, ++forcestop, false);

        } else {
          console.log('stopped to long setIcon loop!!!');
        }
      }
    }
  }

  setXY(x: number, y: number) {
    this.setX(x);
    this.setY(y);
  }

  setX(x: number) {
    // console.log("set x to: " + x + "px");
    if (this.checkHitRight(0, x)) {
      x = this.icon.parentNode.clientWidth - this.icon.clientWidth;
      this.hitRight = true;
    }
    if (this.checkHitLeft(0, x)) {
      x = 0;
      this.hitLeft = true;
    }
    // console.log("set corrected x to: " + x + "px");
    this.icon.style.left = `${x}px`;
  }

  setY(y: number) {
    // console.log("set y to: " + y + "px");
    if (this.checkHitBottom(0, y)) {
      y = (this.icon.parentNode.clientHeight - this.icon.clientHeight);
      this.hitBottom = true;
    }
    if (this.checkHitTop(0, y)) {
      y = 0;
      this.hitTop = true;
    }
    // console.log("set corrected y to: " + y + "px");
    this.icon.style.top = `${y}px`;
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
  getImg() {
    return this.icon;
  }

  setImg(img: HTMLElement) {
    this.icon = img;
  }

  static cornerHitCount = 0;
  static wallHitsCount = 0;
  static printstats = false;
  static filterColors = [
    'invert(.3) sepia(1) saturate(8) hue-rotate(70deg)', // green
    'invert(.63) sepia(1) saturate(8) hue-rotate(70deg)', // light green
    'invert(.8) sepia(1) saturate(5) hue-rotate(150deg)', // light blue
    'invert(.2) sepia(1) saturate(7) hue-rotate(180deg)', // blue
    'invert(.5) sepia(1) saturate(5) hue-rotate(260deg)', // pink
    'invert(.5) sepia(1) saturate(5) hue-rotate(340deg)', // orange
    'invert(.8) sepia(1) saturate(5) hue-rotate(350deg)', // yellow
  ];

  static operate = {
    '+': (a: number, b: number): number => {
      return a + b;
    },
    '-': (a: number, b: number): number => {
      return a - b;
    },
  };
}

(() => {
  const dvdstats = document.getElementById('dvd-stats');
  if (dvdstats != null) {
    DvdScreensaver.printstats = true;
    dvdstats.style.position = 'fixed';
    dvdstats.style.bottom = '0';
    dvdstats.style.left = '0';

    let newDiv = document.createElement('div');
    let newSpan = document.createElement('spann');
    let newContent = document.createTextNode('Cornerhits');
    newSpan.setAttribute('id', 'dvd-cornerhits');
    newSpan.textContent = '0';
    newDiv.appendChild(newSpan);
    newDiv.appendChild(newContent);
    dvdstats.appendChild(newDiv);

    newDiv = document.createElement('div');
    newSpan = document.createElement('spann');
    newContent = document.createTextNode('Wallhits');
    newSpan.setAttribute('id', 'dvd-wallhits');
    newSpan.textContent = '0';
    newDiv.appendChild(newSpan);
    newDiv.appendChild(newContent);
    dvdstats.appendChild(newDiv);
  }
})();

function dvdlogoStatsUpdate() {
  if (DvdScreensaver.printstats) {
    const wallhitsCounter = document.getElementById('dvd-wallhits');
    if (wallhitsCounter) {
      wallhitsCounter.innerHTML = DvdScreensaver.wallHitsCount.toString();
    }
    const cornerhitsCounter = document.getElementById('dvd-cornerhits');
    if (cornerhitsCounter) {
      cornerhitsCounter.innerHTML = DvdScreensaver.cornerHitCount.toString();
    }
  }
}

const randomIntFromIntervalNoRepeat = (() => {
  let oldNumberOfFunction = 0;
  return (min: number, max: number, oldNumber?: number): number => {
    if (typeof oldNumber !== 'undefined') {
      oldNumberOfFunction = oldNumber;
    }
    let num = randomIntFromInterval(min, max);
    // if the number is the same as the old number, simply increment it:
    if (num === oldNumberOfFunction) {
      num++;
    }
    if (num > max) {
      num = 0;
    }
    oldNumberOfFunction = num;
    return num;
  };
})();

function randomIntFromInterval(min: number, max: number): number { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function splitNumberUnit(str: string): string[] | null {
  return str.match(/[0-9]+|[^0-9]+/gi);
}
