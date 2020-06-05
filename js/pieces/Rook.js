import { Piece, TYPE, SYMBOL } from "../Piece.js";
import { left, right, above, below } from "../helperFunctions.js";

export class Rook extends Piece {
    constructor(color) {
        super(color, TYPE.ROOK, SYMBOL.ROOK);
    }

    potentialSquares(pieceConfig) {
        const [x, y] = this.getPosition(pieceConfig);
        const list = [
            ...this.potentialSquaresWithin(left(x, y), pieceConfig),
            ...this.potentialSquaresWithin(below(x, y), pieceConfig),
            ...this.potentialSquaresWithin(above(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(right(x, y, pieceConfig.size), pieceConfig),
        ];
        return list;
    }
}
