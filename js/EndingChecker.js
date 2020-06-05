import { equalMaps } from "./helperFunctions.js";
import { TYPE, COLOR } from "./Piece.js";

export class EndingChecker {
    constructor(game) {
        this.game = game;
    }

    noMoves() {
        return this.game.pieceConfig.pieces
            .filter((piece) => piece.color === this.game.status.turn)
            .every((piece) => piece.cannotMove(this.game.pieceConfig));
    }

    insufficientMaterial() {
        const pieces = this.game.pieceConfig.pieces;
        const posmap = this.game.pieceConfig.posmap;
        if (pieces.length <= 3) {
            const allowedTypes = [TYPE.KING, TYPE.BISHOP, TYPE.KNIGHT];
            if (pieces.every((piece) => allowedTypes.includes(piece.type))) {
                return true;
            }
        } else if (pieces.length === 4) {
            const [bishop1, bishop2] = pieces.filter((piece) => piece.type !== TYPE.KING);
            const [pos1, pos2] = [posmap.get(bishop1), posmap.get(bishop2)];
            if (
                bishop1.type === TYPE.BISHOP &&
                bishop2.type === TYPE.BISHOP &&
                bishop1.color !== bishop2.color &&
                (pos1[0] + pos1[1]) % 2 === (pos2[0] + pos2[1]) % 2
            ) {
                return true;
            }
        } else {
            return false;
        }
    }

    rule75() {
        return (
            this.game.status.moveNumber >=
            Math.max(this.game.history.lastPawnMove, this.game.history.lastCaptureMove) + 75
        );
    }

    repetition5() {
        const currentMap = this.game.pieceConfig.posmap;
        let repeatCounter = 1;
        for (let move = this.game.status.moveNumber - 1; move >= 0.5; move -= 1) {
            const previousMap = this.game.history.posmap.get(move);
            const equal = equalMaps(currentMap, previousMap);
            if (equal) repeatCounter++;
        }
        return repeatCounter >= 5;
    }

    checkAutomaticDraw() {
        const status = this.game.status;
        if (this.insufficientMaterial()) {
            status.outcome = "Draw by insufficient material";
            return true;
        } else if (this.rule75()) {
            status.outcome = "Draw by 75-move rule";
            return true;
        } else if (this.repetition5()) {
            status.outcome = "Draw by 5-fold repetition";
            return true;
        }
    }

    checkMateStaleMate() {
        const status = this.game.status;
        if (this.noMoves()) {
            if (this.game.pieceConfig.checkPosition(status.turn)) {
                status.winner = status.turn === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
                status.outcome = `${status.winner} wins by checkmate`;
                return true;
            } else {
                status.outcome = "Draw by stalemate";
                return true;
            }
        }
    }

    checkEnding() {
        return this.checkMateStaleMate() || this.checkAutomaticDraw();
    }
}
