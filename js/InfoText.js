import { getEl } from "./helperFunctions.js";

export function createInfoText() {
    const infoImg = getEl("infoImg");
    const infoText = getEl("infoText");
    infoImg.addEventListener("mouseover", () => {
        infoText.style.display = "block";
    });
    infoImg.addEventListener("mouseout", () => {
        infoText.style.display = "none";
    });
}
