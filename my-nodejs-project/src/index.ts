const COMPONENT_TYPES = {
    GUN: {
        value: 0x00_00_00_01,
        mask: 0x00_00_00_FF,
        name: "Gun",
    },
    LASER: {
        value: 0x00_00_01_00,
        mask: 0x00_00_FF_00,
        name: "Laser",
    },
    GAUNTLET: {
        value: 0x00_01_00_00,
        mask: 0x00_FF_00_00,
        name: "Gauntlet",
    },
    MISSILE: {
        value: 0x01_00_00_00,
        mask: 0xFF_00_00_00,
        name: "Missile",
    },
}

function component_get_counts(component: number) {
    return {
        gun: (component & COMPONENT_TYPES.GUN.mask),
        laser: (component & COMPONENT_TYPES.LASER.mask) >> 8,
        gauntlet: (component & COMPONENT_TYPES.GAUNTLET.mask) >> 16,
        missile: (component & COMPONENT_TYPES.MISSILE.mask) >> 24
    };
}

function component_print(components: number): void {
    const counts = component_get_counts(components);
    let stringBuilder = [];

    for(let i = 0; i < counts.gun; i++) {
        stringBuilder.push(COMPONENT_TYPES.GUN.name);
    }

    for(let i = 0; i < counts.laser; i++) {
        stringBuilder.push(COMPONENT_TYPES.LASER.name);
    }

    for(let i = 0; i < counts.gauntlet; i++) {
        stringBuilder.push(COMPONENT_TYPES.GAUNTLET.name);
    }

    for(let i = 0; i < counts.missile; i++) {
        stringBuilder.push(COMPONENT_TYPES.MISSILE.name);
    }

    console.log(`${stringBuilder.join(" + ")}`);
}


function subsetRecursive(items: number[], pickCount: number, currentKey: number, currentSubset: number[], resultSubsets: Map<number, number[]>): void {
    if ( pickCount === 0) {
        resultSubsets.set(currentKey, [...currentSubset]);
        return;
    }

    for(let i = 0; i < items.length; i++) {
        currentKey += items[i];
        if( resultSubsets.has(currentKey) ) {
            currentKey -= items[i];
            continue;
        }

        currentSubset.push(items[i]);
        subsetRecursive(items, pickCount - 1, currentKey, currentSubset, resultSubsets);
        currentSubset.pop();
        currentKey -= items[i];
    }
}

function subsets(items: number[], pickCount: number): Array<number[]> {
    const subsets = new Map<number, number[]>();
    const subset: number[] = [];
    const key = 0;

    subsetRecursive(items, pickCount, key, subset, subsets);

    return Array.from(subsets.values());
}

function subsetsAll(items: number[], pickCount: number): Array<number[]> {
    const subsets = new Map<number, number[]>();
    const subset: number[] = [];
    const key = 0;

    for (let i = pickCount; i > 0; i -= 1) {
        subsetRecursive(items, i, key, subset, subsets);
    }

    return Array.from(subsets.values());
}

function subsetsGeneral<T>(items: T[], pickCount: number): Array<T[]> {
    const subsets: T[][] = [];
    const subset: T[] = [];

    subsetRecursiveGeneral(items, pickCount, subset, subsets);

    return subsets;
}


function subsetRecursiveGeneral<T>(items: T[], pickCount: number, currentSubset: Array<T>, resultSubsets: Array<T[]>): void {
    if ( pickCount === 0) {
        resultSubsets.push([...currentSubset]);
        return;
    }

    for(let i = 0; i < items.length; i++) {
        const item: T = items.shift()!;
        currentSubset.push(item);
        subsetRecursiveGeneral([...items], pickCount - 1, currentSubset, resultSubsets);
        currentSubset.pop();
        items.push(item); // Restore the item to the end of the array
    }
}

/// (objectcount = slot1, slot2, slot3, slot4) group count = 4 (gun, laser, gauntlet, missile)
function C(objectCount: number, groupCount: number) {
    // Ensure R is not greater than N - R
    groupCount = Math.min(groupCount, objectCount - groupCount);

    let ans = 1;
    for (let i = 0; i < groupCount; i++) {
        ans = ans * (objectCount - i);
        ans = ans / (i + 1);
    }
    return ans;
}

/// (objectcount = slot1, slot2, slot3, slot4) group count = 4 (gun, laser, gauntlet, missile)
function getWaysWithZero(objectCount: number, groupCount: number) {
    // Calculate C(N + K - 1, K - 1)
    return C(objectCount + groupCount - 1, groupCount - 1);
}


function starsAndBarsRecursiveHelper(objectCount: number, groupCount: number, bins: number[], results: number[][]): void {
    if(groupCount === 0) {
        return void results.push([...bins]);
    }
    if(groupCount === 1) {
         // All objects go into the first bin
        bins[0] = objectCount;
        return starsAndBarsRecursiveHelper(0, 0, bins, results);
    }
    for( let i = 0; i <= objectCount; i += 1) {
        // Place i objects in the current bin
        bins[groupCount - 1] = i;
        starsAndBarsRecursiveHelper(objectCount - i, groupCount - 1, bins, results);
    }
}

function starsAndBarsRecursive(objectCount: number, groupCount: number): number[][] {
    const results: number[][] = [];
    const bins: number[] = new Array(groupCount).fill(0);

    starsAndBarsRecursiveHelper(objectCount, groupCount, bins, results);

    return results;
}

function starsAndBars(objectCount: number, groupCount: number): number[][] {
    const results = [];
    const bins: number[] = new Array(groupCount).fill(0);
    bins[0] = objectCount; // Start with all objects in the first bin

    const lastBinIndex = groupCount - 1;
    while(true) {
        console.log(bins);
        // Store the current state of bins
        results.push([...bins]);

        // If the last bin has all objects, we are done
        if( bins[lastBinIndex] == objectCount ) {
            break;
        }

        if(bins[0] > 0) {
            bins[0] -= 1;
            bins[1] += 1;
        } else {
            let firstNonEmptyBinIndex = 1 
            while (bins[firstNonEmptyBinIndex] == 0) {
                firstNonEmptyBinIndex += 1;
            }
            bins[0] = bins[firstNonEmptyBinIndex] - 1;
            bins[firstNonEmptyBinIndex+1] += 1
            bins[firstNonEmptyBinIndex] = 0
        }
    }

    console.log(`Combinations: ${results.length}`);
    return results;
}




function mainTestFunc() {
    console.log("Doing main")
    const exampleItems = ["A", "B", "C"];
    //console.log(exampleItems)
    //const result = GetDistinctCombinations(exampleItems, 3);

    const results = subsetsAll([COMPONENT_TYPES.GUN.value, COMPONENT_TYPES.LASER.value, COMPONENT_TYPES.GAUNTLET.value, COMPONENT_TYPES.MISSILE.value], 4);
    //const results = subsetsGeneral(exampleItems, 3);

    for (const result of results) {
        console.log(result);
    }

    console.log(`Results Found: ${results.length}`);

    // Number of objects and groups
    let N = 4;
    let K = 4;

    // Display the result
    console.log(`Ways to divide ${N} objects among ${K} groups such that a group can have 0 objects are ${getWaysWithZero(N, K)}`);

    starsAndBars(N, K);

    console.log("Now doing recursive method of stars and bars");
    console.log(`Ways to divide ${N} objects among ${K} groups such that a group can have 0 objects are ${getWaysWithZero(N, K)}`);
    let recursiveResults = starsAndBarsRecursive(N, K);
    recursiveResults.forEach((result) => {
        console.log(result);
    });
    console.log(`Count: ${recursiveResults.length}`);
}
//expected out put

mainTestFunc();







// TREE TREE TREE
// TREE TREE GUN
// TREE TREE ROCK
// TREE ROCK GUN
// GUN GUN GUN
// GUN GUN ROCK
// GUN GUN TREE
// ROCK ROCK ROCK
// ROCK ROCK GUN
// ROCK ROCK TREE
