import { hasElement } from "./helperFunctions.js";
import { Move } from "./Move.js";

export class PieceController {
    constructor(game) {
        this.game = game;
        this.initialize();
        this.addControls();
    }

    initialize() {
        this.selectedPiece = null;
    }

    addControls() {
        const board = this.game.board;
        for (let i = 0; i < board.size; i++) {
            for (let j = 0; j < board.size; j++) {
                const pos = [i, j];
                const square = board.getSquareAt(pos);
                square.addEventListener("click", () => this.clickAt(pos));
                square.addEventListener("dragover", (e) => e.preventDefault());
                square.addEventListener("drop", (e) => {
                    e.preventDefault();
                    this.addDropFeature(pos);
                });
            }
        }
    }

    addDragFeature(piece) {
        const status = this.game.status;
        piece.image.addEventListener("dragstart", () => {
            if (status.isLocked) return;
            if (piece.color === status.turn) this.select(piece);
        });
    }

    addDropFeature(pos) {
        const status = this.game.status;
        if (status.isLocked) return;
        const squares = this.game.highlightController.highlightedSquares;
        this.initiateMove(squares, pos);
    }

    clickAt(pos) {
        const status = this.game.status;
        if (status.isLocked) return;
        const squares = this.game.highlightController.highlightedSquares;
        const pieceConfig = this.game.pieceConfig;
        if (pieceConfig.hasPieceAt(pos) && status.turn === pieceConfig.getPieceAt(pos).color) {
            this.select(pieceConfig.getPieceAt(pos));
        } else {
            this.initiateMove(squares, pos);
        }
    }

    initiateMove(squares, pos) {
        if (this.selectedPiece && hasElement(squares, pos)) {
            const selPos = this.selectedPiece.getPosition(this.game.pieceConfig);
            const move = new Move(this.selectedPiece, selPos, pos, this.game.status.moveNumber);
            move.execute(this.game);
        }
    }

    select(piece) {
        const hictrl = this.game.highlightController;
        if (piece !== this.selectedPiece) {
            if (this.selectedPiece) {
                hictrl.hidePiece(this.selectedPiece);
                if (hictrl.on) hictrl.hideAllowedSquares();
                hictrl.highlightedSquares = piece.allowedSquares(this.game.pieceConfig);
                if (hictrl.on) hictrl.highlightAllowedSquares();
            }
            this.selectedPiece = piece;
            hictrl.highlightPieceAt(this.selectedPiece.getPosition(this.game.pieceConfig));
        } else {
            this.selectedPiece = null;
            hictrl.hidePiece(this.selectedPiece);
        }
    }
}
