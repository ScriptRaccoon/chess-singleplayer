import { Piece, TYPE, SYMBOL } from "../Piece.js";
import {
    left,
    right,
    above,
    below,
    aboveleft,
    aboveright,
    belowleft,
    belowright,
} from "../helperFunctions.js";

export class Queen extends Piece {
    constructor(color) {
        super(color, TYPE.QUEEN, SYMBOL.QUEEN);
    }

    potentialSquares(pieceConfig) {
        const [x, y] = this.getPosition(pieceConfig);
        const list = [
            ...this.potentialSquaresWithin(aboveleft(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(aboveright(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(belowleft(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(belowright(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(right(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(above(x, y, pieceConfig.size), pieceConfig),
            ...this.potentialSquaresWithin(left(x, y), pieceConfig),
            ...this.potentialSquaresWithin(below(x, y), pieceConfig),
        ];
        return list;
    }
}
