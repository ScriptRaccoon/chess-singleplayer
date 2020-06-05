import { mobileView, getEl } from "./helperFunctions.js";

const arrowLeft = getEl("arrowLeft");
const arrowRight = getEl("arrowRight");
const arrowLeftEnd = getEl("arrowLeftEnd");
const arrowRightEnd = getEl("arrowRightEnd");

export class History {
    constructor(game) {
        this.game = game;
        this.moves = new Map();
        this.posmap = new Map();
        this.lastCaptureMove = 0.5;
        this.lastPawnMove = 0.5;
        this.addArrowControls();
    }

    clear() {
        this.moves.clear();
        this.posmap.clear();
        this.lastCaptureMove = 0.5;
        this.lastPawnMove = 0.5;
    }

    restoreFirst() {
        this.restore(0.5);
    }

    restoreLast() {
        this.restore(this.game.status.moveNumber - 0.5);
    }

    restorePrevious() {
        if (this.game.status.displayedMoveNumber >= 1)
            this.restore(this.game.status.displayedMoveNumber - 0.5);
    }

    restoreNext() {
        if (this.game.status.displayedMoveNumber + 0.5 < this.game.status.moveNumber)
            this.restore(this.game.status.displayedMoveNumber + 0.5);
    }

    restore(number) {
        const game = this.game;
        if (game.status.duringPromotion) return;
        game.status.displayedMoveNumber = number;
        game.status.viewMode = number === game.status.moveNumber - 0.5 ? false : true;
        game.notation.highlight(number);
        if (mobileView()) {
            game.notation.scroll(number, game.status.moveNumber);
        }
        game.status.showTurn(number + 0.5);
        game.board.clear();
        for (const [piece, pos] of this.posmap.get(number).entries()) {
            piece.image.style.setProperty("--x-animation", "0px");
            piece.image.style.setProperty("--y-animation", "0px");
            game.board.add(piece.image, pos);
        }
        if (game.highlightController.on && number >= 1) {
            const move = this.moves.get(number);
            game.highlightController.highlightMove(move);
            game.highlightController.highlightCheck(move.checkPosition);
        }
    }

    addArrowControls() {
        arrowLeft.addEventListener("click", () => this.restorePrevious());
        arrowRight.addEventListener("click", () => this.restoreNext());
        arrowLeftEnd.addEventListener("click", () => this.restoreFirst());
        arrowRightEnd.addEventListener("click", () => this.restoreLast());
    }

    addMoveControl(number) {
        const span = getEl(`move${number}`);
        span.addEventListener("click", () => this.restore(number));
    }
}
