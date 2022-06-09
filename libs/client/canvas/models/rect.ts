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

    contains(otherRect: Rect) {
        return (
            this.minX < otherRect.minX &&
            this.maxX > otherRect.maxX &&
            this.minY < otherRect.minY &&
            this.maxY > otherRect.maxY
        );
    }

    containsXY(x: number, y: number) {
        return (
            this.minX <= x && x < this.maxX && this.minY <= y && y < this.maxY
        );
    }
}

export default Rect;
