import { Piece, TYPE, SYMBOL } from "../Piece.js";

export class King extends Piece {
    constructor(color) {
        super(color, TYPE.KING, SYMBOL.KING);
    }

    potentialSquares(pieceConfig) {
        const [x, y] = this.getPosition(pieceConfig);
        const list = [];
        for (const u of [-1, 0, +1]) {
            for (const v of [-1, 0, +1]) {
                if ((u !== 0 || v !== 0) && this.canStepOn([x + u, y + v], pieceConfig)) {
                    list.push([x + u, y + v]);
                }
            }
        }
        return list;
    }

    castlingSquares(pieceConfig) {
        if (this.numberMoves > 0 || this.isThreatened(pieceConfig)) return [];
        const [x, y] = this.getPosition(pieceConfig);
        const list = [];
        for (const rookx of [0, pieceConfig.size - 1]) {
            const walkSpots = rookx === 0 ? [x - 1, x - 2] : [x + 1, x + 2];
            const freeSpots = rookx === 0 ? [...walkSpots, x - 3] : walkSpots;
            if (
                pieceConfig.hasPieceAt([rookx, y]) &&
                pieceConfig.getPieceAt([rookx, y]).type === TYPE.ROOK &&
                pieceConfig.getPieceAt([rookx, y]).numberMoves === 0 &&
                freeSpots.every((u) => !pieceConfig.hasPieceAt([u, y])) &&
                walkSpots.every((u) => !this.causesThreatAfterMove(this, [u, y], pieceConfig))
            ) {
                list.push([rookx === 0 ? x - 2 : x + 2, y]);
            }
        }
        return list;
    }
}
