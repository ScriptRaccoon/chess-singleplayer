import { Piece, TYPE, SYMBOL } from "../Piece.js";
import { aboveleft, aboveright, belowleft, belowright } from "../helperFunctions.js";

export class Bishop extends Piece {
    constructor(color) {
        super(color, TYPE.BISHOP, SYMBOL.BISHOP);
    }

    potentialSquares(pieceConfig) {
        const [x, y] = this.getPosition(pieceConfig);
        const list = [
            ...this.potentialSquaresWithin(aboveleft(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(aboveright(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(belowleft(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(belowright(x, y, pieceConfig.size), pieceConfig),
        ];
        return list;
    }
}
