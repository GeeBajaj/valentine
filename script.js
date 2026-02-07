// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Click Envelope

envelope.addEventListener("click", () => {
    envelope.style.display = "none";
    letter.style.display = "flex";

    setTimeout( () => {
        document.querySelector(".letter-window").classList.add("open");
    },50);
});

// Logic to move the NO btn (minimum distance, stay on screen)
const MIN_MOVE = 160;
const MAX_MOVE = 200;
let noBtnOffsetX = 0;
let noBtnOffsetY = 0;

noBtn.addEventListener("mouseover", () => {
    const rect = noBtn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const padding = 16;

    // Flow position = where the button would be without transform
    const flowLeft = rect.left - noBtnOffsetX;
    const flowTop = rect.top - noBtnOffsetY;

    // Random direction, distance between MIN_MOVE and MAX_MOVE
    const distance = Math.random() * (MAX_MOVE - MIN_MOVE) + MIN_MOVE;
    const angle = Math.random() * Math.PI * 2;
    let moveX = Math.cos(angle) * distance;
    let moveY = Math.sin(angle) * distance;

    // Target position on screen
    let targetLeft = flowLeft + moveX;
    let targetTop = flowTop + moveY;

    // Viewport bounds (with padding)
    const minLeft = padding;
    const maxLeft = vw - rect.width - padding;
    const minTop = padding;
    const maxTop = vh - rect.height - padding;

    // Yes button zone we must never overlap (with gap)
    const gap = 8;
    const yesRect = yesBtn.getBoundingClientRect();
    const noWidth = rect.width;
    const noHeight = rect.height;
    const yesZoneLeft = yesRect.left - gap - noWidth;
    const yesZoneRight = yesRect.right + gap;
    const yesZoneTop = yesRect.top - gap - noHeight;
    const yesZoneBottom = yesRect.bottom + gap;

    // Clamp to viewport first
    targetLeft = Math.max(minLeft, Math.min(maxLeft, targetLeft));
    targetTop = Math.max(minTop, Math.min(maxTop, targetTop));

    // If we're in the Yes zone, push to nearest side (fully left/right and/or fully above/below)
    if (targetLeft < yesZoneRight && targetLeft + noWidth > yesZoneLeft) {
        const pushLeft = yesZoneLeft - targetLeft;
        const pushRight = yesZoneRight - targetLeft;
        targetLeft += Math.abs(pushLeft) <= Math.abs(pushRight) ? pushLeft : pushRight;
    }
    if (targetTop < yesZoneBottom && targetTop + noHeight > yesZoneTop) {
        const pushUp = yesZoneTop - targetTop;
        const pushDown = yesZoneBottom - targetTop;
        targetTop += Math.abs(pushUp) <= Math.abs(pushDown) ? pushUp : pushDown;
    }

    // Re-clamp to viewport but NEVER into the Yes zone (valid = viewport minus Yes zone)
    const leftSegmentEnd = Math.min(maxLeft, yesZoneLeft);
    const rightSegmentStart = Math.max(minLeft, yesZoneRight);
    const hasLeftSegment = leftSegmentEnd >= minLeft;
    const hasRightSegment = rightSegmentStart <= maxLeft;
    if (targetLeft <= yesZoneLeft && hasLeftSegment) {
        targetLeft = Math.max(minLeft, Math.min(leftSegmentEnd, targetLeft));
    } else if (targetLeft >= yesZoneRight && hasRightSegment) {
        targetLeft = Math.max(rightSegmentStart, Math.min(maxLeft, targetLeft));
    } else if (hasLeftSegment && hasRightSegment) {
        targetLeft = targetLeft - yesZoneLeft <= yesZoneRight - targetLeft
            ? Math.max(minLeft, Math.min(leftSegmentEnd, targetLeft))
            : Math.max(rightSegmentStart, Math.min(maxLeft, targetLeft));
    } else if (hasLeftSegment) {
        targetLeft = Math.max(minLeft, Math.min(leftSegmentEnd, targetLeft));
    } else if (hasRightSegment) {
        targetLeft = Math.max(rightSegmentStart, Math.min(maxLeft, targetLeft));
    }
    const topSegmentEnd = Math.min(maxTop, yesZoneTop);
    const bottomSegmentStart = Math.max(minTop, yesZoneBottom);
    const hasTopSegment = topSegmentEnd >= minTop;
    const hasBottomSegment = bottomSegmentStart <= maxTop;
    if (targetTop <= yesZoneTop && hasTopSegment) {
        targetTop = Math.max(minTop, Math.min(topSegmentEnd, targetTop));
    } else if (targetTop >= yesZoneBottom && hasBottomSegment) {
        targetTop = Math.max(bottomSegmentStart, Math.min(maxTop, targetTop));
    } else if (hasTopSegment && hasBottomSegment) {
        targetTop = targetTop - yesZoneTop <= yesZoneBottom - targetTop
            ? Math.max(minTop, Math.min(topSegmentEnd, targetTop))
            : Math.max(bottomSegmentStart, Math.min(maxTop, targetTop));
    } else if (hasTopSegment) {
        targetTop = Math.max(minTop, Math.min(topSegmentEnd, targetTop));
    } else if (hasBottomSegment) {
        targetTop = Math.max(bottomSegmentStart, Math.min(maxTop, targetTop));
    }

    noBtnOffsetX = targetLeft - flowLeft;
    noBtnOffsetY = targetTop - flowTop;

    noBtn.style.transition = "transform 0.3s ease";
    noBtn.style.transform = `translate(${noBtnOffsetX}px, ${noBtnOffsetY}px)`;
});

// Logic to make YES btn to grow

// let yesScale = 1;

// yesBtn.style.position = "relative"
// yesBtn.style.transformOrigin = "center center";
// yesBtn.style.transition = "transform 0.3s ease";

// noBtn.addEventListener("click", () => {
//     yesScale += 2;

//     if (yesBtn.style.position !== "fixed") {
//         yesBtn.style.position = "fixed";
//         yesBtn.style.top = "50%";
//         yesBtn.style.left = "50%";
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }else{
//         yesBtn.style.transform = `translate(-50%, -50%) scale(${yesScale})`;
//     }
// });

// YES is clicked

yesBtn.addEventListener("click", () => {
    title.textContent = "Yippeeee!";

    catImg.src = "cat_dance.gif";

    document.querySelector(".letter-window").classList.add("final");

    buttons.style.display = "none";

    finalText.style.display = "block";
});
