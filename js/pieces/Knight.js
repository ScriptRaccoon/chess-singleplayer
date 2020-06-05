import { Piece, TYPE, SYMBOL } from "../Piece.js";

export class Knight extends Piece {
    constructor(color) {
        super(color, TYPE.KNIGHT, SYMBOL.KNIGHT);
    }

    potentialSquares(pieceConfig) {
        const [x, y] = this.getPosition(pieceConfig);
        const list = [];
        for (let sign1 of [+1, -1]) {
            for (let sign2 of [+1, -1]) {
                for (let xstep of [0, 1]) {
                    const i = x + sign1 * (xstep + 1);
                    const j = y + sign2 * (2 - xstep);
                    if (this.canStepOn([i, j], pieceConfig)) {
                        list.push([i, j]);
                    }
                }
            }
        }
        return list;
    }
}
