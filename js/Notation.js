import { getEl, getClEl, createEl } from "./helperFunctions.js";
import { COLOR } from "./Piece.js";
import { CASTLING } from "./Move.js";

const notationPanel = getEl("notationPanel");

export class Notation {
    getSquareSymbol([x, y]) {
        const COLS = ["a", "b", "c", "d", "e", "f", "g", "h"];
        const ROWS = ["8", "7", "6", "5", "4", "3", "2", "1"];
        return COLS[x] + ROWS[y];
    }

    start() {
        const firstSpan = createEl(
            "span",
            "firstSpan moveSpan currentSpan",
            notationPanel,
            "0. Start"
        );
        firstSpan.id = `move${0.5}`;
    }

    getString(move) {
        const start = move.color === COLOR.WHITE ? move.number + ". " : "";
        const base =
            move.castling === CASTLING.LONG
                ? "O-O-O"
                : move.castling === CASTLING.SHORT
                ? "O-O"
                : move.piece.symbol +
                  this.getSquareSymbol(move.start) +
                  (move.capturedPiece ? "x" : "-") +
                  this.getSquareSymbol(move.destination) +
                  (move.enpassant ? "e.p." : "") +
                  (move.promotionPiece ? `=${move.promotionPiece.symbol}` : "");
        const checkSymbol = move.checkPosition ? (move.checkMate ? "#" : "+") : "";
        return start + base + checkSymbol;
    }

    notate(move) {
        const nota = this.getString(move);
        const span = createEl("span", "moveSpan", notationPanel, nota);
        span.id = `move${move.number}`;
        this.highlight(move.number);
        notationPanel.scrollTop = notationPanel.scrollHeight;
        notationPanel.scrollLeft = notationPanel.scrollWidth;
    }

    highlight(number) {
        const previousSpan = getClEl("currentSpan");
        if (previousSpan) previousSpan.classList.remove("currentSpan");
        const currentSpan = getEl(`move${number}`);
        currentSpan.classList.add("currentSpan");
    }

    end(winner, outcome) {
        const outcomeSymbol = winner ? (winner === COLOR.WHITE ? "1-0" : "0-1") : "½ - ½";
        createEl("span", "outcomeSymbolSpan", notationPanel, outcomeSymbol);
        createEl("span", "outcomeSpan", notationPanel, outcome);
        notationPanel.scrollTop = notationPanel.scrollHeight;
        notationPanel.scrollLeft = notationPanel.scrollWidth;
    }

    clear() {
        notationPanel.innerHTML = "";
    }

    scroll(currentNumber, moveNumber) {
        const currentSpan = getEl(`move${currentNumber}`);
        const left = currentSpan.offsetLeft;
        const right = left + currentSpan.clientWidth;
        const scroll = notationPanel.scrollLeft;
        const width = notationPanel.clientWidth;
        if (currentNumber === moveNumber - 0.5) {
            notationPanel.scrollLeft = left;
        } else if (left - scroll <= (1 / 4) * width) {
            notationPanel.scrollLeft = left - (1 / 4) * width;
        } else if (right - scroll >= (3 / 4) * width) {
            notationPanel.scrollLeft = right - (3 / 4) * width;
        }
    }
}
