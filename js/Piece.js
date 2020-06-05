// prettier-ignore
import { hasElement} from "./helperFunctions.js";

export const COLOR = { BLACK: "Black", WHITE: "White" };

export const TYPE = {
    BISHOP: "Bishop",
    KING: "King",
    KNIGHT: "Knight",
    PAWN: "Pawn",
    QUEEN: "Queen",
    ROOK: "Rook",
    ZEBRA: "Zebra",
};

export const SYMBOL = {
    BISHOP: "B",
    KING: "K",
    KNIGHT: "N",
    PAWN: "",
    QUEEN: "Q",
    ROOK: "R",
    ZEBRA: "Z",
};

export class Piece {
    constructor(color, type, symbol) {
        this.color = color;
        this.type = type;
        this.symbol = symbol;
        this.image = new Image();
        this.image.src = `./img/${this.type}-${this.color.toLowerCase()}.png`;
        this.image.classList.add("piece");
        this.numberMoves = 0;
        this.dir = this.color === COLOR.WHITE ? -1 : +1;
    }

    getPosition(pieceConfig) {
        return pieceConfig.posmap.get(this);
    }

    potentialSquares() {
        return [];
    }

    isThreatened(pieceConfig) {
        const pos = this.getPosition(pieceConfig);
        return pieceConfig.pieces.some(
            (piece) =>
                piece.color !== this.color && hasElement(piece.potentialSquares(pieceConfig), pos)
        );
    }

    moveTo(destination, game) {
        const [x, y] = this.getPosition(game.pieceConfig);
        const [i, j] = destination;
        const img = this.image;
        const [sizex, sizey] = [img.clientWidth, img.clientHeight];
        const sign = game.board.rotated ? -1 : +1;
        const [offsetx, offsety] = [sign * (x - i) * sizex, sign * (y - j) * sizey];
        game.pieceConfig.movePieceTo(this, [i, j]);
        img.style.setProperty("--x-animation", `${offsetx}px`);
        img.style.setProperty("--y-animation", `${offsety}px`);
        game.board.add(img, [i, j]);
        this.numberMoves++;
    }

    captureAfterMove([i, j], pieceConfig) {
        const [x, y] = this.getPosition(pieceConfig);
        if (pieceConfig.hasPieceAt([i, j])) {
            const pos = [i, j];
            const piece = pieceConfig.getPieceAt(pos);
            return { pos: pos, piece: piece };
        } else {
            if (this.type === TYPE.PAWN && x !== i) {
                const pos = [i, j - this.dir];
                const piece = pieceConfig.getPieceAt(pos);
                return { pos: pos, piece: piece, enpassant: true };
            } else {
                return null;
            }
        }
    }

    causesThreatAfterMove(otherPiece, pos, pieceConfig) {
        const [x, y] = this.getPosition(pieceConfig);
        const capture = this.captureAfterMove(pos, pieceConfig);
        if (capture) pieceConfig.removePiece(capture.piece, capture.pos);
        pieceConfig.movePieceTo(this, pos);
        const threat = otherPiece.isThreatened(pieceConfig);
        pieceConfig.movePieceTo(this, [x, y]);
        if (capture) {
            pieceConfig.setPieceAt(capture.piece, capture.pos);
        }
        return threat;
    }

    allowedSquares(pieceConfig) {
        const king = pieceConfig.getKing(this.color);
        const potentialSquares = this.potentialSquares(pieceConfig);
        if (this === king) {
            potentialSquares.push(...this.castlingSquares(pieceConfig));
        }
        return potentialSquares.filter(
            (pos) => !this.causesThreatAfterMove(king, pos, pieceConfig)
        );
    }

    cannotMove(pieceConfig) {
        return this.allowedSquares(pieceConfig).length === 0;
    }

    potentialSquaresWithin(interval, pieceConfig) {
        const list = [];
        for (const pos of interval) {
            if (this.canStepOn(pos, pieceConfig)) {
                list.push(pos);
                if (pieceConfig.hasPieceAt(pos)) {
                    return list;
                }
            } else {
                return list;
            }
        }
        return list;
    }

    canStepOn(pos, pieceConfig) {
        return (
            pieceConfig.hasCoord(pos) &&
            !(pieceConfig.hasPieceAt(pos) && pieceConfig.getPieceAt(pos).color === this.color)
        );
    }

    isPromotable(pieceConfig) {
        const [x, y] = this.getPosition(pieceConfig);
        return (
            this.type === TYPE.PAWN &&
            ((this.color === COLOR.WHITE && y === 0) ||
                (this.color === COLOR.BLACK && y === pieceConfig.size - 1))
        );
    }
}
