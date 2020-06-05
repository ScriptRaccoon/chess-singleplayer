import { COLOR } from "./Piece.js";
import { getEl } from "./helperFunctions.js";

const circle = getEl("circleImg");

export class Status {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.moveNumber = 1;
        this.displayedMoveNumber = 0.5;
        this.turn = COLOR.WHITE;
        this.viewMode = false;
        this.duringPromotion = false;
        this.outcome = null;
        this.winner = null;
    }

    get isLocked() {
        return this.duringPromotion || this.outcome || this.viewMode;
    }

    changeTurn() {
        this.turn = this.turn === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
    }

    showTurn(number) {
        if (!number) number = this.moveNumber;
        if (Number.isInteger(number)) {
            circle.classList.remove("blackCircle");
        } else {
            circle.classList.add("blackCircle");
        }
    }
}
