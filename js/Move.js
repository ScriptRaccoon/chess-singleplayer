import { TYPE } from "./Piece.js";
import { Queen } from "./pieces/Queen.js";
import { Rook } from "./pieces/Rook.js";
import { Bishop } from "./pieces/Bishop.js";
import { Knight } from "./pieces/Knight.js";
import { createEl } from "./helperFunctions.js";
import { boardDiv } from "./Board.js";

export const CASTLING = { LONG: "long", SHORT: "short" };

export class Move {
    constructor(piece, start, destination, number) {
        this.piece = piece;
        this.start = start;
        this.destination = destination;
        this.number = number;
        this.color = this.piece.color;
        this.enpassant = false;
        this.capturedPiece = null;
        this.promotionPiece = null;
        this.castling = null;
        this.checkPosition = null;
        this.checkMate = false;
    }

    preProcessMove(game) {
        game.highlightController.hidePiece();
        game.highlightController.clear();
        if (game.highlightController.on) game.highlightController.highlightMove(this);
        game.pieceConfig.previousPiece = this.piece;
        game.pieceController.selectedPiece = null;
        if (this.piece.type === TYPE.PAWN) {
            game.history.lastPawnMove = game.status.thisNumber;
        }
    }

    execute(game) {
        this.preProcessMove(game);
        this.tryCapture(game);
        this.tryCastling(game);
        this.piece.moveTo(this.destination, game);
        if (this.piece.isPromotable(game.pieceConfig)) {
            this.executePromotion(game);
        } else {
            this.postProcess(game);
        }
    }

    tryCapture(game) {
        const capture = this.piece.captureAfterMove(this.destination, game.pieceConfig);
        if (capture) {
            game.removePiece(capture.piece);
            this.enpassant = capture.enpassant;
            game.history.lastCaptureMove = this.number;
        }
    }

    tryCastling(game) {
        const [x, y] = this.start;
        const [i, j] = this.destination;
        if (this.piece.type === TYPE.KING && Math.abs(x - i) === 2) {
            if (i < x) {
                this.castling = CASTLING.LONG;
                const rook = game.pieceConfig.getPieceAt([0, y]);
                rook.moveTo([x - 1, y], game);
            } else if (i > x) {
                this.castling = CASTLING.SHORT;
                const rook = game.pieceConfig.getPieceAt([game.board.size - 1, y]);
                rook.moveTo([x + 1, y], game);
            }
        }
    }

    executePromotion(game) {
        const pawn = this.piece;
        game.status.duringPromotion = true;
        const promotionDiv = createEl("div", "promotion", boardDiv);
        const suggestedPieces = [
            new Queen(pawn.color),
            new Rook(pawn.color),
            new Bishop(pawn.color),
            new Knight(pawn.color),
        ];
        for (const newPiece of suggestedPieces) {
            const image = new Image();
            image.src = newPiece.image.src;
            promotionDiv.appendChild(image);
            image.addEventListener("click", () => {
                boardDiv.removeChild(promotionDiv);
                game.removePiece(pawn);
                game.addPiece(newPiece, this.destination);
                this.promotionPiece = newPiece;
                game.status.duringPromotion = false;
                this.postProcess(game);
            });
        }
    }

    postProcess(game) {
        game.status.changeTurn();
        game.endingChecker.checkEnding();
        this.checkPosition = game.pieceConfig.checkPosition(game.status.turn);
        this.checkMate = game.status.winner ? true : false;
        game.highlightController.highlightCheck(this.checkPosition);
        game.notation.notate(this);
        game.history.posmap.set(this.number, new Map(game.pieceConfig.posmap));
        game.history.moves.set(this.number, this);
        game.history.addMoveControl(this.number);
        if (game.status.outcome) game.notation.end(game.status.winner, game.status.outcome);
        game.status.moveNumber += 0.5;
        game.status.displayedMoveNumber += 0.5;
        game.status.showTurn();
    }
}
