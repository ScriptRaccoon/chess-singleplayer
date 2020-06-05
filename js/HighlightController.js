import { getEl, getClEl, getClEls, createEl } from "./helperFunctions.js";

export class HighlightController {
    constructor(game) {
        this.game = game;
        this.on = true;
        this.highlightedSquares = [];
        this.addControls();
    }

    addControls() {
        getEl("highlightButton").addEventListener("click", () => this.toggle());
        const board = this.game.board;
        for (let i = 0; i < board.size; i++) {
            for (let j = 0; j < board.size; j++) {
                const pos = [i, j];
                const square = board.getSquareAt(pos);
                square.addEventListener("mouseover", () => this.toggleHoverAt(pos, true));
                square.addEventListener("mouseout", () => this.toggleHoverAt(pos, false));
            }
        }
    }

    clear() {
        this.hideAllowedSquares();
        this.clearHighlightedSquares();
        this.hideMove();
        this.hideCheck();
    }

    clearHighlightedSquares() {
        this.highlightedSquares.length = 0;
    }

    highlightAllowedSquares() {
        for (const [i, j] of this.highlightedSquares) {
            const square = this.game.board.getSquareAt([i, j]);
            createEl("div", "square-allowed", square);
        }
    }

    hideAllowedSquares() {
        for (const circle of getClEls("square-allowed")) {
            circle.remove();
        }
    }

    toggleHoverAt(pos, hover) {
        const status = this.game.status;
        if (status.isLocked || !this.game.pieceConfig.hasPieceAt(pos)) return;
        const piece = this.game.pieceConfig.getPieceAt(pos);
        if (status.turn === piece.color && !this.game.pieceController.selectedPiece) {
            if (hover) {
                this.highlightedSquares = piece.allowedSquares(this.game.pieceConfig);
                if (this.on) this.highlightAllowedSquares();
            } else {
                this.clearHighlightedSquares();
                if (this.on) this.hideAllowedSquares();
            }
        }
    }

    highlightPieceAt(pos) {
        const square = this.game.board.getSquareAt(pos);
        createEl("div", "square-piece", square);
    }

    hidePiece() {
        getClEl("square-piece").remove();
    }

    highlightMove(move) {
        const startSquare = this.game.board.getSquareAt(move.start);
        const destinationSquare = this.game.board.getSquareAt(move.destination);
        for (const square of [startSquare, destinationSquare]) {
            createEl("div", "square-move", square);
        }
    }

    hideMove() {
        for (const highlight of getClEls("square-move")) {
            highlight.remove();
        }
    }

    highlightCheck(pos) {
        if (pos && this.on) {
            const square = this.game.board.getSquareAt(pos);
            createEl("div", "square-danger", square);
        }
    }

    hideCheck() {
        const squareDanger = getClEl("square-danger");
        if (squareDanger) squareDanger.remove();
    }

    toggle() {
        if (this.game.status.duringPromotion) return;
        getEl("highlightButton").classList.toggle("buttonOff");
        getEl("movingCircle").classList.toggle("circleOff");
        this.on = !this.on;
        if (!this.on) {
            this.hideMove();
            this.hideAllowedSquares();
            this.hideCheck();
        } else {
            if (this.game.status.displayedMoveNumber >= 1) {
                const move = this.game.history.moves.get(this.game.status.displayedMoveNumber);
                this.highlightMove(move);
                this.highlightAllowedSquares();
                this.highlightCheck(move.checkPosition);
            }
        }
    }
}
