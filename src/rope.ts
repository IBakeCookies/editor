export class Rope {
    static SPLIT_LENGTH = 1000;
    static JOIN_LENGTH = 500;
    static REBALANCE_RATIO = 1.2;

    private _value: string;
    private _left: Rope;
    private _right: Rope;
    length: number;

    constructor(str) {
        this._value = str;
        this.length = str.length;
        this.adjust();
    }

    adjust() {
        if (typeof this._value !== 'undefined') {
            if (this.length > Rope.SPLIT_LENGTH) {
                const divide = Math.floor(this.length / 2);
                this._left = new Rope(this._value.substring(0, divide));
                this._right = new Rope(this._value.substring(divide));
                // @ts-ignore
                this._value = null;
            }
        } else {
            if (this.length < Rope.JOIN_LENGTH) {
                this._value = this._left.toString() + this._right.toString();
                // @ts-ignore
                this._left = {};
                // @ts-ignore
                this._right = {};
            }
        }
    }

    toString() {
        if (typeof this._value !== 'undefined') {
            return this._value;
        } else {
            return this._left.toString() + this._right.toString();
        }
    }

    remove(start, end) {
        let deleted = '';
        if (start < 0 || start > this.length) {
            throw new RangeError('Start is not within rope bounds.');
        }

        if (end < 0 || end > this.length) throw new RangeError('End is not within rope bounds.');
        if (start > end) throw new Error('Start is greater than end.');

        if (typeof this._value !== 'undefined') {
            deleted = this._value.substring(start, end);

            this._value = this._value.substring(0, start) + this._value.substring(end);
            this.length = this._value.length;
        } else {
            const leftLength = this._left.length;
            const leftStart = Math.min(start, leftLength);
            const leftEnd = Math.min(end, leftLength);
            const rightLength = this._right.length;
            const rightStart = Math.max(0, Math.min(start - leftLength, rightLength));
            const rightEnd = Math.max(0, Math.min(end - leftLength, rightLength));

            if (leftStart < leftLength) {
                this._left.remove(leftStart, leftEnd);
            }
            if (rightEnd > 0) {
                this._right.remove(rightStart, rightEnd);
            }
            this.length = this._left.length + this._right.length;
        }

        this.adjust();

        return deleted;
    }

    insert(position, value) {
        if (typeof value !== 'string') {
            value = value.toString();
        }
        if (position < 0 || position > this.length)
            throw new RangeError('Position is not within rope bounds.');

        if (typeof this._value !== 'undefined') {
            this._value =
                this._value.substring(0, position) + value + this._value.substring(position);
            this.length = this._value.length;
        } else {
            const leftLength = this._left.length;
            if (position < leftLength) {
                this._left.insert(position, value);
                this.length = this._left.length + this._right.length;
            } else {
                this._right.insert(position - leftLength, value);
            }
        }
        this.adjust();
    }

    rebuild() {
        if (typeof this._value === 'undefined') {
            this._value = this._left.toString() + this._right.toString();
            // @ts-ignore
            this._left = null;
            // @ts-ignore
            this._right = null;
            this.adjust();
        }
    }

    rebalance() {
        if (typeof this._value === 'undefined') {
            if (
                this._left.length / this._right.length > Rope.REBALANCE_RATIO ||
                this._right.length / this._left.length > Rope.REBALANCE_RATIO
            ) {
                this.rebuild();
            } else {
                this._left.rebalance();
                this._right.rebalance();
            }
        }
    }

    substring(start, end = this.length) {
        if (start < 0 || isNaN(start)) start = 0;
        if (start > this.length) start = this.length;
        if (end < 0 || isNaN(end)) end = 0;
        if (end > this.length) end = this.length;

        if (typeof this._value !== 'undefined') {
            return this._value.substring(start, end);
        } else {
            const leftLength = this._left.length;
            const leftStart = Math.min(start, leftLength);
            const leftEnd = Math.min(end, leftLength);
            const rightStart = Math.max(0, start - leftLength);
            const rightEnd = Math.max(0, end - leftLength);

            if (leftStart !== leftEnd) {
                if (rightStart !== rightEnd) {
                    return (
                        this._left.substring(leftStart, leftEnd) +
                        this._right.substring(rightStart, rightEnd)
                    );
                } else {
                    return this._left.substring(leftStart, leftEnd);
                }
            } else {
                if (rightStart !== rightEnd) {
                    return this._right.substring(rightStart, rightEnd);
                } else {
                    return '';
                }
            }
        }
    }

    substr(start, length) {
        let end;
        if (start < 0) {
            start = this.length + start;
            if (start < 0) start = 0;
        }
        if (length === undefined) {
            end = this.length;
        } else {
            if (length < 0) length = 0;
            end = start + length;
        }
        return this.substring(start, end);
    }

    charAt(position) {
        return this.substring(position, position + 1);
    }

    charCodeAt(position) {
        return this.substring(position, position + 1).charCodeAt(0);
    }
}
