const canvas = document.getElementById('render');
const ctx = canvas.getContext('2d');

const btn = document.getElementById('preptodie');
const rldbtn = document.getElementById('rld');

document.addEventListener("DOMContentLoaded", () => {

    rldbtn.onclick = () => { rld() };

    //access -> map[y -> 0 - rows][x -> 0 - columns]
    const columndef = 25;
    const rowdef = 12;

    const isdefined = (map, row, col) => { return map[row] !== undefined && map[row][col] !== undefined; }

    //Map Generator Algorithm
    function MAPGEN(columns, rows, rowcurr = 8, colcurr = 0) {
        let map = new Array(rows);// Map Array


        //Blank Space Flood Fill
        for (let i = 0; i < rows; i++) {
            map[i] = new Array(columns).fill(0);
        }
        //Starting Point
        map[rowcurr][colcurr] = 0;
        let found = 0;// Constraint for Loop till Favourable Path is Found
        const dir = [[-1, 0], [0, 1], [1, 0]]; // Direction Array

        //Looping Path Tracer until end point contains column 3
        while (1 != found) {
            for (let j = 0; j < 40 * 2; j++) {
                let value = Math.floor(Math.random() * dir.length);//Random Index For Direction Array
                value = value == 3 ? 2 : value; // Rare Case Check
                let [dr, dc] = dir[value];//Random Direction
                if (isdefined(map, rowcurr + dr, colcurr + dc) && colcurr + dc >= 0 && colcurr + dc < columns) {
                    rowcurr += dr; colcurr += dc;//Move Pointer
                    map[rowcurr][colcurr] = 1;//Fill Path
                    if (isdefined(map, rowcurr, colcurr + dc)) {
                        map[rowcurr][colcurr + dc] = 1//Adding FLood while continuing towards the right direction
                    }
                }

            }

            if (map[8][columns - 1] == 1) {
                found++;
                break;
            }
        }

        //End Filter, to remove garbage values
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (map[i][j] === 0 && isdefined(map, i - 1, j) && map[i - 1][j] == 1) {
                    map[i][j] = 1;
                }
            }
        }

        let fixed = 0;
        let emptyset = new Array(columns).fill(0);
        let downpadding = new Array(columns).fill(1);
        while (fixed < 1) {
            for (let i = 0; i < rows; i++) {
                let result = map[i].every((value) => { value === 1 });
                if (result) {
                    map = map.filter((_, ind) => { ind !== i });
                    map.unshift(emptyset);
                } else { fixed += 1; }
            }
        }
        if (!map[rows - 1].every((val => val === 1))) {
            map.push(downpadding);
        }
        for (let j = 0; j < 5; j++) {
            map[j] = emptyset;
        }

        for (let j = 0; j < rows; j++) {
            while (map[j].length > columns) {
                map[j].pop();
            }
        }
        while (map.length > rows) {
            map.shift();
        }

        return map;
    }

    const combineArrays = (arrays) => {
        const rows = arrays[0].length; // Number of rows
        const cols = arrays.reduce((sum, array) => sum + array[0].length, 0); // Total width
        const combined = [];

        for (let i = 0; i < rows; i++) {
            const row = [];
            for (const array of arrays) {
                row.push(...array[i]);
            }
            combined.push(row);
        }
        // for (let j = 0; j < cols; j++) {
        //     for (let i = 0; j < rows; i++) {
        //         if (isdefined(combined, i, j) && combined[i][j] === 0) {
        //             if (isdefined(combined, i, j - 1) && isdefined(combined, i, j + 1) && combined[i][j + 1] === 1 && combined[i][j - 1] === 1) {
        //                 combined[i][j] = 1;
        //             } else if (!isdefined(combined, i, j - 1) && isdefined(combined, i, j + 1) && combined[i][j + 1] === 1) {
        //                 combined[i][j] = 1;
        //             } else if (isdefined(combined, i, j - 1) && !isdefined(combined, i, j + 1) && combined[i][j - 1] === 1) {
        //                 combined[i][j] = 1;
        //             }
        //         }
        //     }
        // }
        return combined;
    };

    //Client Side Drawing
    const drawArrayOnCanvas = (array) => {
        const canvas = document.getElementById('render');
        const ctx = canvas.getContext('2d');

        const cellSize = 20; // Size of each subelement (adjust as needed)
        canvas.width = array[0].length * cellSize; // Total width
        canvas.height = array.length * cellSize; // Total height

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                const value = array[i][j];
                ctx.fillStyle = value === 1 ? 'black' : 'white'; // Black for 1, White for 0
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    };
    const removeColumns = (array) => {
        const rows = array.length;
        const cols = array[0].length;
        const columnCounts = Array(cols).fill(0);

        // Count the number of 1s in each column
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (array[i][j] === 1) {
                    columnCounts[j]++;
                }
            }
        }

        // Keep only columns where the count of 1s is not exactly 2
        // AND exclude the first and last column
        const filteredArray = array.map(row => {
            return row.filter((_, colIndex) =>
                colIndex !== 0 && // Exclude first column
                colIndex !== cols - 1 && // Exclude last column
                columnCounts[colIndex] > 2 // Exclude columns with exactly two black blocks
            );
        });
        
        for (let rows = 0;rows < filteredArray.length; rows++) {
            while (filteredArray[rows].length > 100) {
                filteredArray[rows].pop();
            }
        }
        return filteredArray;
    };

    //Prints Map to Console
    function printmap(map) {
        console.log(map);
    }

    function rld() {
        let map = removeColumns(combineArrays([MAPGEN(columndef, rowdef), MAPGEN(columndef, rowdef), MAPGEN(columndef, rowdef), MAPGEN(columndef, rowdef), MAPGEN(columndef, rowdef)]));
        btn.onclick = () => { printmap(map) };
        drawArrayOnCanvas(map);
    }

    rld();
});
