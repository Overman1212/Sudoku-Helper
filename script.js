// Initialize grid
function initializeGrid() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (j === 2 || j === 5) cell.classList.add('thick-left');
            if (i === 2 || i === 5) cell.classList.add('thick-top');
            
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 9;
            input.dataset.row = i;
            input.dataset.col = j;
            cell.appendChild(input);
            grid.appendChild(cell);
        }
    }
}

// Get current puzzle state
function getCurrentPuzzle() {
    const puzzle = Array(9).fill().map(() => Array(9).fill(0));
    const inputs = document.querySelectorAll('.cell input');
    
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        puzzle[row][col] = input.value ? parseInt(input.value) : 0;
    });
    
    return puzzle;
}

// Solve puzzle
function solvePuzzle() {
    const puzzle = getCurrentPuzzle();
    if (solveSudoku(puzzle)) {
        updateGrid(puzzle);
    } else {
        alert('No solution exists!');
    }
}

// Sudoku solver using backtracking
function solveSudoku(grid) {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) return true;
    
    const [row, col] = emptyCell;
    
    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

// Helper functions for solver
function findEmptyCell(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) return [i, j];
        }
    }
    return null;
}

function isValid(grid, row, col, num) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) return false;
        }
    }
    
    return true;
}

// Update grid with solution
function updateGrid(solution) {
    const inputs = document.querySelectorAll('.cell input');
    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        if (!input.value) {
            input.value = solution[row][col];
            input.classList.remove('initial');
        } else {
            input.classList.add('initial');
        }
    });
}

// Get random puzzle from API
async function getRandomPuzzle() {
    try {
        const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
        const data = await response.json();
        const puzzle = data.newboard.grids[0].value;
        loadPuzzle(puzzle);
    } catch (error) {
        alert('Error fetching puzzle. Using sample puzzle instead.');
        loadSamplePuzzle();
    }
}

// Load puzzle into grid
function loadPuzzle(puzzle) {
    const inputs = document.querySelectorAll('.cell input');
    inputs.forEach((input, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const value = puzzle[row][col];
        input.value = value || '';
        input.classList.toggle('initial', !!value);
    });
}

// Sample puzzle for fallback
function loadSamplePuzzle() {
    const sample = [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]
    ];
    loadPuzzle(sample);
}

// Clear grid
function clearGrid() {
    const inputs = document.querySelectorAll('.cell input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('initial');
    });
}

// Initialize on load
window.onload = initializeGrid;
