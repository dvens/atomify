/**
 * @export
 * @returns { array }
 */
export function buildThresholdList() {
    const numSteps = 1000;
    const thresholds = [];

    for (let i = 1.0; i <= numSteps; i++) {
        const ratio = i / numSteps;
        thresholds.push(ratio);
    }

    thresholds.push(0);
    return thresholds;
}
