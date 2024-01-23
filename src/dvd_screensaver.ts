/// <reference types="vite/client" />
import DVDVideoLogoSvgCode from '../img/DVD-Video_Logo.svg';

type Direction = '+'|'-';

export interface DvdScreensaverOptions {
  icon?: HTMLElement|null;
  animationActive?: boolean;
  addStyle?: boolean;
  changeColor?: boolean;
  iconParent?: HTMLElement;
  width?: string;
  height?: string;
  startX?: number;
  startY?: number;
  speedX?: number;
  speedY?: number;
  dirX?: Direction;
  dirY?: Direction;
}

export default class DvdScreensaver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private icon: HTMLElement & {
    parentNode: HTMLElement,
  }; // HTMLElements makes much errors currently => any (for now)
  private animationActive: number;
  private stopAnimation: number;
  private oldColorNumber: number;
  private shouldCheckCornerHit: boolean;

  private speedX: number;
  private speedY: number;

  private dirX: Direction;
  private dirY: Direction;

  /**
   * Counters (nor read jet)
   */
  private cornerHits: number;
  private wallHits: number;

  private hitTop: boolean;
  private hitRight: boolean;
  private hitBottom: boolean;
  private hitLeft: boolean;

  constructor(options: DvdScreensaverOptions = {}) {

    if (typeof options.icon === 'undefined') {
      options.icon = null;
    }
    if (typeof options.animationActive === 'undefined') {
      options.animationActive = true;
    }
    if (typeof options.addStyle === 'undefined') {
      options.addStyle = true;
    }
    if (typeof options.changeColor === 'undefined') {
      options.changeColor = true;
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

      options.iconParent.appendChild(img);
      options.icon = img;
    }
    // @ts-expect-error workaround for other ts errors, parentNode is assumed to be a HTMLElement here
    this.icon = options.icon;

    if (this.icon.parentNode.isEqualNode(document.body)) {
      this.icon.style.position = 'fixed';
    } else {
      this.icon.style.position = 'absolute';
    }

    if (options.addStyle) {
      // @ts-expect-error ugly and incorrect, but this is just a sample tool practice project, so who cares.
      this.changeWidth(options.width, false);
      this.icon.style.background = 'transparent';
      this.icon.style.cssText += 'pointer-events: none;';
      this.icon.style.cssText += 'user-select: none;';
    }

    this.oldColorNumber = -1;
    if (options.changeColor) {
      this.oldColorNumber = 0;
    }
    this.changeColor();
    this.speedX = options.speedX;
    this.speedY = options.speedY;
    this.dirX = options.dirX;
    this.dirY = options.dirY;

    this.shouldCheckCornerHit = false; // variable to only check corner hit after wall hit
    this.cornerHits = 0;
    this.wallHits = 0;
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
      this.icon.style.height = (parseFloat(this.icon.style.height) / parseFloat(this.icon.style.width) * width).toString();
    } else {
      this.icon.style.height = 'auto';
    }
    this.icon.style.width = width.toString();
  }

  getWidth(split: true): string[]|null;
  getWidth(split: false): string;
  getWidth(split = false): string|string[]|null {
    if (split) {
      return splitNumberUnit(this.getWidth(false));
    }
    return this.icon.style.width;
  }

  changeHeight(height: number, keepSideRatio = true) {
    if (keepSideRatio) {
      this.icon.style.width = (parseFloat(this.icon.style.width) / parseFloat(this.icon.style.height) * height).toString();
    } else {
      this.icon.style.width = 'auto';
    }
    this.icon.style.height = height.toString();
  }


  getHeight(split: true): string[]|null;
  getHeight(split: false): string;
  getHeight(split = false): string|string[]|null {
    if (split) {
      return splitNumberUnit(this.getHeight(false));
    } else {
      return this.icon.style.height;
    }
  }

  changeSize(width: number, height: number) {
    this.icon.style.width = width.toString();
    this.icon.style.height = height.toString();
  }

  changeSpeed(speedX: number, speedY: number) {
    this.speedX = speedX;
    this.speedY = speedY;
  }

  changeDir(dirX: Direction, dirY: Direction) {
    this.dirX = dirX;
    this.dirY = dirY;
  }

  private wallHit(countWallHit: boolean) {
    if (countWallHit) {
      // TODO: always true anyway, remove flag in future here and in all calling functions?
      DvdScreensaver.wallHitsCount++;
    }
    this.wallHits++;
    DvdScreensaver.dvdlogoStatsUpdate();
    this.shouldCheckCornerHit = true;
    this.changeColor();
  }

  private checkWallHit(countWallHit = false) {
    let wallHit = false;
    if (this.hitTop || this.checkHitTop()) {
      this.hitTop = false;
      this.dirY = '+';
      this.wallHit(countWallHit);
      wallHit = true;
    }
    if (this.hitRight || this.checkHitRight()) {
      this.hitRight = false;
      this.dirX = '-';
      this.wallHit(countWallHit);
      wallHit = true;
    }
    if (this.hitBottom || this.checkHitBottom()) {
      this.hitBottom = false;
      this.dirY = '-';
      this.wallHit(countWallHit);
      wallHit = true;
    }
    if (this.hitLeft || this.checkHitLeft()) {
      this.hitLeft = false;
      this.dirX = '+';
      this.wallHit(countWallHit);
      wallHit = true;
    }
    return wallHit;
  }

  private checkHitTop(addValue = 0, absolutePos = this.getIconY()) {
    //  return this.getIconY()  <= 0;
    return DvdScreensaver.operate[this.dirY](absolutePos, addValue) <= 0;
  }

  private checkHitRight(addValue = 0, absolutePos = this.getIconX()) {
    //  return this.getIconX()  + this.icon.clientWidth >= this.icon.parentNode.clientWidth;
    return DvdScreensaver.operate[this.dirX](absolutePos, addValue) +
    this.icon.clientWidth >= this.icon.parentNode.clientWidth;
  }

  private checkHitBottom(addValue = 0, absolutePos = this.getIconY()) {
    //  return this.getIconY() + this.icon.clientHeight >= this.icon.parentNode.clientHeight;
    return DvdScreensaver.operate[this.dirY](absolutePos, addValue) +
    this.icon.clientHeight >= this.icon.parentNode.clientHeight;
  }

  private checkHitLeft(addValue = 0, absolutePos = this.getIconX()) {
    //  return this.getIconX()  <= 0;
    return DvdScreensaver.operate[this.dirX](absolutePos, addValue) <= 0;
  }

  private checkCornerHit() {
    let cornerHit = false;
    if (this.shouldCheckCornerHit) {
      this.shouldCheckCornerHit = false;
      if ((this.checkHitTop() && this.checkHitLeft()) ||
        (this.checkHitTop() && this.checkHitRight()) ||
        (this.checkHitBottom() && this.checkHitLeft()) ||
        (this.checkHitBottom() && this.checkHitRight())
      ) {
        DvdScreensaver.cornerHitCount++;
        this.cornerHits++;
        DvdScreensaver.dvdlogoStatsUpdate();
        cornerHit = true;
      }
    }
    return cornerHit;
  }

  private checkHit(countWallHit = false) {
    const hit = this.checkWallHit(countWallHit);
    this.checkCornerHit();
    return hit;
  }

  getIconX() {
    // return this.icon.x; //this method results in false coordinates while zooming in browser
    return parseInt(this.icon.style.left, 10);
  }
  getIconY() {
    // return this.icon.y; //this method results in false coordinates while zooming in browser
    return parseInt(this.icon.style.top, 10);
  }

  private setIcon(xAdd = 0, yAdd = 0, forceStop = 0, useDefaults = true) {
    let xAdd2 = 0;
    let yAdd2 = 0;
    if (useDefaults) {
      xAdd = this.speedX;
      yAdd = this.speedY;
    } else {
      //  console.log("add x " + xAdd + "!!!, add y " + yAdd + "!!!");
    }

    if (this.dirX === '+') {
      if (this.checkHitRight(xAdd)) {
        xAdd2 = DvdScreensaver.operate[this.dirX](this.getIconX(), xAdd) -
        (this.icon.parentNode.clientWidth - this.icon.clientWidth);
      }
    } else {
      if (this.checkHitLeft(xAdd)) {
        xAdd2 = -DvdScreensaver.operate[this.dirX](this.getIconX(), xAdd);
      }
    }
    this.setX(DvdScreensaver.operate[this.dirX](this.getIconX(), xAdd));

    if (this.dirY === '+') {
      if (this.checkHitBottom(yAdd)) {
        yAdd2 = DvdScreensaver.operate[this.dirY](this.getIconY(), yAdd) -
        (this.icon.parentNode.clientHeight - this.icon.clientHeight);
      }
    } else {
      if (this.checkHitTop(yAdd)) {
        yAdd2 = -DvdScreensaver.operate[this.dirY](this.getIconY(), yAdd);
      }
    }
    this.setY(DvdScreensaver.operate[this.dirY](this.getIconY(), yAdd));

    if (this.checkHit(true)) {
      if (xAdd2 !== 0 || yAdd2 !== 0) {
        if (forceStop < 10) {
          this.setIcon(xAdd2, yAdd2, ++forceStop, false);

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

  private update() {
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
    if (img.parentNode && img.parentNode instanceof HTMLElement) {
      throw new Error('img parentNode must be set and a htmlElement');
    }
    // @ts-expect-error parentNode can still be null, but ignore that here
    this.icon = img;
  }

  static cornerHitCount = 0;
  static wallHitsCount = 0;
  private static filterColors = [
    'invert(.3) sepia(1) saturate(8) hue-rotate(70deg)', // green
    'invert(.63) sepia(1) saturate(8) hue-rotate(70deg)', // light green
    'invert(.8) sepia(1) saturate(5) hue-rotate(150deg)', // light blue
    'invert(.2) sepia(1) saturate(7) hue-rotate(180deg)', // blue
    'invert(.5) sepia(1) saturate(5) hue-rotate(260deg)', // pink
    'invert(.5) sepia(1) saturate(5) hue-rotate(340deg)', // orange
    'invert(.8) sepia(1) saturate(5) hue-rotate(350deg)', // yellow
  ];

  private static operate = {
    '+': (a: number, b: number): number => {
      return a + b;
    },
    '-': (a: number, b: number): number => {
      return a - b;
    },
  };


  private static printStats: {
    cornerHits?: HTMLSpanElement,
    wallHits?: HTMLSpanElement,
  }|null = null;
  static enableStatistics() {
    const dvdStats = document.createElement('div');
    dvdStats.style.position = 'fixed';
    dvdStats.style.bottom = '0';
    dvdStats.style.left = '0';

    DvdScreensaver.createStatsElemBasic(dvdStats);

    document.body.appendChild(dvdStats);
  }

  static createStatsElemBasic(dvdStats: HTMLElement) {
    const cornerHitWrapper = document.createElement('div');
    const cornerHitSpan = document.createElement('span');
    cornerHitSpan.textContent = '0';
    cornerHitWrapper.appendChild(cornerHitSpan);
    cornerHitWrapper.appendChild(document.createTextNode('corner hits'));
    dvdStats.appendChild(cornerHitWrapper);
  
    const wallHitWrapper = document.createElement('div');
    const wallHitSpan = document.createElement('span');
    wallHitSpan.textContent = '0';
    wallHitWrapper.appendChild(wallHitSpan);
    wallHitWrapper.appendChild(document.createTextNode('wall hits'));
    dvdStats.appendChild(wallHitWrapper);

    DvdScreensaver.printStats = {
      cornerHits: cornerHitSpan,
      wallHits: wallHitSpan,
    };
  }

  private static dvdlogoStatsUpdate() {
    if (DvdScreensaver.printStats) {
      if (DvdScreensaver.printStats.wallHits) {
        DvdScreensaver.printStats.wallHits.innerHTML = DvdScreensaver.wallHitsCount.toString();
      }
      if (DvdScreensaver.printStats.cornerHits) {
        DvdScreensaver.printStats.cornerHits.innerHTML = DvdScreensaver.cornerHitCount.toString();
      }
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
