import { Piece, TYPE, SYMBOL } from "../Piece.js";

export class Pawn extends Piece {
    constructor(color) {
        super(color, TYPE.PAWN, SYMBOL.PAWN);
    }

    potentialSquares(pieceConfig) {
        const [x, y] = this.getPosition(pieceConfig);
        const dir = this.dir;
        const list = [];
        // move forward
        if (pieceConfig.hasCoord([x, y + dir]) && !pieceConfig.hasPieceAt([x, y + dir])) {
            list.push([x, y + dir]);
        }
        // move two steps forward (as a first move)
        if (
            this.numberMoves === 0 &&
            pieceConfig.hasCoord([x, y + 2 * dir]) &&
            !pieceConfig.hasPieceAt([x, y + dir]) &&
            !pieceConfig.hasPieceAt([x, y + 2 * dir])
        ) {
            list.push([x, y + 2 * dir]);
        }
        // capture diagonally
        for (const xdir of [+1, -1]) {
            if (
                pieceConfig.hasCoord([x + xdir, y + dir]) &&
                pieceConfig.hasPieceAt([x + xdir, y + dir])
            ) {
                const piece = pieceConfig.getPieceAt([x + xdir, y + dir]);
                if (piece.color !== this.color) {
                    list.push([x + xdir, y + dir]);
                }
            }
        }
        // en passant
        for (const xdir of [+1, -1]) {
            if (
                pieceConfig.hasCoord([x + xdir, y]) &&
                pieceConfig.hasCoord([x + xdir, y + dir]) &&
                pieceConfig.hasPieceAt([x + xdir, y])
            ) {
                const piece = pieceConfig.getPieceAt([x + xdir, y]);
                if (
                    piece.type === TYPE.PAWN &&
                    piece.color !== this.color &&
                    piece === pieceConfig.previousPiece &&
                    piece.numberMoves === 1 &&
                    ![2, pieceConfig.size - 3].includes(piece.getPosition(pieceConfig)[1])
                ) {
                    list.push([x + xdir, y + dir]);
                }
            }
        }
        return list;
    }
}
