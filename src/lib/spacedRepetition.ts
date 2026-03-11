export interface ReviewScore {
    quality: 0 | 1 | 2 | 3 | 4 | 5; // 0: forgot, 5: perfect
}

/**
 * SuperMemo-2 (SM-2) Algorithm
 * @param quality 0-5 rating
 * @param previousInterval days
 * @param previousEase 1.3 - 2.5+
 * @param reviewCount number of times reviewed
 */
export function calculateNextReview(
    quality: number,
    previousInterval: number,
    previousEase: number,
    reviewCount: number
) {
    let interval: number;
    let ease: number;

    if (quality >= 3) {
        if (reviewCount === 0) {
            interval = 1;
        } else if (reviewCount === 1) {
            interval = 6;
        } else {
            interval = Math.round(previousInterval * previousEase);
        }

        ease = previousEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
        reviewCount = 0;
        interval = 1;
        ease = previousEase;
    }

    if (ease < 1.3) ease = 1.3;

    const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000;

    return {
        interval,
        ease,
        reviewCount: reviewCount + 1,
        nextReviewDate
    };
}
