const canvas = document.getElementById('render');
const ctx = canvas.getContext('2d');

const btn = document.getElementById('preptodie');
const rldbtn = document.getElementById('rld');

document.addEventListener("DOMContentLoaded", () => {
    const blocksize = 40;
    const rows = Math.floor(canvas.height / blocksize);
    const columns = Math.floor(canvas.width / blocksize);
    
    rldbtn.onclick = () => {rld()};
    
    //access -> map[y -> 0 - rows][x -> 0 - columns]
    

    //Map Generator Algorithm
    function MAPGEN(blocksize,columns,rowcurr=3, colcurr=0) {
        let map = new Array(columns);// Map Array
        
        //Strict Checking for Out Of Map Coordinates
        const isdefined = (map,row,col) => {return map[row] !== undefined && map[row][col] !== undefined;}
        //Blank Space Flood Fill
        for (let i = 0; i < rows; i++) {
            map[i] = new Array(columns).fill(1);
        }
        //Starting Point
        map[rowcurr][colcurr] = 0;
        let found = 0;// Constraint for Loop till Favourable Path is Found
        const dir = [[-1,0],[0,1],[1,0]]; // Direction Array

        //Looping Path Tracer until end point contains column 3
        while (1 != found) {
            for (let j = 0;j < blocksize*2; j++){
                let value = Math.floor(Math.random() * dir.length);//Random Index For Direction Array
                value = value == 3 ? 2: value; // Rare Case Check
                let [dr,dc] = dir[value];//Random Direction
                if ( isdefined(map,rowcurr+dr,colcurr+dc) && colcurr+dc >= 0 && colcurr+dc < columns ) {
                    rowcurr += dr;colcurr+= dc;//Move Pointer
                    map[rowcurr][colcurr] = 0;//Fill Path
                    if (isdefined(map,rowcurr,colcurr+dc)){
                        map[rowcurr][colcurr+dc] = 0//Adding FLood while continuing towards the right direction
                    }
                }
                
            }
            if (map[3][columns-1] == 0) {
                found++;
                break;
            }       
        }

        //End Filter, to remove garbage values
        for (let j = 0;j< rows;j++) {
            while (map[j].length > columns) {
                map[j].pop()
            }
        }
        map[4][0] == 0;
        map[2][0] == 0;
        map[4][columns-1] == 0;
        map[2][columns-1] == 0;
        return map;
    }

    //Client Side Drawing
    function drawMap(map,blocksize,columns,rows) {
        for (let col = 0; col < columns; col++) {
            for (let row = 0; row < rows; row++) {
                ctx.fillStyle = map[row][col] === 0 ? 'white' : 'black';
                ctx.fillRect(col * blocksize, row * blocksize, blocksize, blocksize);
            }
        }
    }

    //Prints Map to Console
    function printmap(map) {
        console.log(map);
    }

    function rld() {
        let map = MAPGEN(blocksize,columns);
        btn.onclick = () => {printmap(map)};
        drawMap(map,blocksize,columns,rows);
    }

    rld();
});
