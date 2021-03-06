class Rect {
    _x: number;
    _y: number;
    _width: number;
    _height: number;
    constructor(x: number, y: number, p_nWidth: number, p_nHeight: number) {
        this._x = x;
        this._y = y;
        this._width = p_nWidth;
        this._height = p_nHeight;
    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get minX() {
        return this._x;
    }
    get minY() {
        return this._y;
    }
    get maxX() {
        return this._x + this._width;
    }
    get maxY() {
        return this._y + this._height;
    }
    get centerX() {
        return this._x + this._width / 2;
    }
    get centerY() {
        return this._y + this._height / 2;
    }

    move(x: number, y: number) {
        this._x += x;
        this._y += y;
    }

    copy() {
        return new Rect(this._x, this._y, this._width, this._height);
    }

    localRect() {
        return new Rect(0, 0, this.width, this.height);
    }

    contains(otherRect: Rect) {
        return (
            this.minX < otherRect.minX &&
            this.maxX > otherRect.maxX &&
            this.minY < otherRect.minY &&
            this.maxY > otherRect.maxY
        );
    }

    expandToIncludeRect(otherRect: Rect) {
        let maxX = this.maxX;
        let maxY = this.maxY;

        this._x = Math.min(this._x, otherRect._x);
        this._y = Math.min(this._y, otherRect._y);

        maxX = Math.max(maxX, otherRect.maxX);
        maxY = Math.max(maxY, otherRect.maxY);

        this._width = maxX - this._x;
        this._height = maxY - this._y;
    }

    containsXY(x: number, y: number) {
        return (
            this.minX <= x && x < this.maxX && this.minY <= y && y < this.maxY
        );
    }

    getConcentric(scale: number) {
        let newX = this.x - ((scale - 1) * this.width) / 2;
        let newY = this.y - ((scale - 1) * this.height) / 2;
        return new Rect(newX, newY, this.width * scale, this.height * scale);
    }
}

export default Rect;
