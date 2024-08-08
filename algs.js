function puzzleToMatrix(puzzle) {
    let matrix = [];
    for (let y = 0; y < SIZE; y++) {
        let row = [];
        for (let x = 0; x < SIZE; x++) {
            row.push(puzzle.getTile(x, y).num);
        }
        matrix.push(row);
    }
    return matrix;
}

function matrixToPuzzle(matrix) {
    let puzzle = new Puzzle(SIZE, img);
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            puzzle.getTile(x, y).num = matrix[y][x];
            puzzle.getTile(x, y).x = x * puzzle.tileSize;
            puzzle.getTile(x, y).y = y * puzzle.tileSize;
        }
    }
    return puzzle;
}

function bfsPath(puzzle) {
    let startState = puzzleToMatrix(puzzle);
    let goalState = generateGoalState(SIZE);
    return bfs2DMatrix(startState, goalState, SIZE);
}

function dfsPath(puzzle) {
    let startState = puzzleToMatrix(puzzle);
    let goalState = generateGoalState(SIZE);
    return dfs2DMatrix(startState, goalState, SIZE);
}

function bestFirstSearchPath(puzzle) {
    let startState = puzzleToMatrix(puzzle);
    let goalState = generateGoalState(SIZE);
    return aStar2DMatrix(startState, goalState, SIZE);
}

function idfsPath(puzzle) {
    let startState = puzzleToMatrix(puzzle);
    let goalState = generateGoalState(SIZE);
    return idfs2DMatrix(startState, goalState, SIZE);
}

function aStarPath(puzzle) {
    let startState = puzzleToMatrix(puzzle);
    let goalState = generateGoalState(SIZE);
    return aStar2DMatrix(startState, goalState, SIZE);
}

function idaStarPath(puzzle) {
    let startState = puzzleToMatrix(puzzle);
    let goalState = generateGoalState(SIZE);
    return idaStar2DMatrix(startState, goalState, SIZE);
}

function generateGoalState(size) {
    let goalState = [];
    let num = 1;

    // Generate goal state matrix
    for (let y = 0; y < size; y++) {
        let row = [];
        for (let x = 0; x < size; x++) {
            // Fill with numbers from 1 to size*size-1
            if (num < size * size) {
                row.push(num++);
            } else {
                row.push(0); // The last tile is empty (0)
            }
        }
        goalState.push(row);
    }

    return goalState;
}




function bfs2DMatrix(startState, goalState, size) {
    const directions = ['left', 'right', 'up', 'down'];
    const directionVectors = {
        'left': [0, -1],
        'right': [0, 1],
        'up': [-1, 0],
        'down': [1, 0]
    };

    function getNeighbors(state) {
        const neighbors = [];
        const zeroIndex = state.flat().indexOf(0);
        const zeroRow = Math.floor(zeroIndex / size);
        const zeroCol = zeroIndex % size;

        for (const dir of directions) {
            const [dRow, dCol] = directionVectors[dir];
            const newRow = zeroRow + dRow;
            const newCol = zeroCol + dCol;

            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                const newState = JSON.parse(JSON.stringify(state));
                [newState[zeroRow][zeroCol], newState[newRow][newCol]] = [newState[newRow][newCol], newState[zeroRow][zeroCol]];
                neighbors.push({ state: newState, move: dir });
            }
        }

        return neighbors;
    }

    const startTime = performance.now();
    const queue = [{ state: startState, moves: [] }];
    const visited = new Set();
    const goalStr = JSON.stringify(goalState);

    while (queue.length > 0) {
        const { state, moves: currentMoves } = queue.shift();
        const stateStr = JSON.stringify(state);

        if (stateStr === goalStr) {
            const endTime = performance.now();
            return { moves: currentMoves, time: endTime - startTime, depth: currentMoves.length };
        }

        if (visited.has(stateStr)) continue;
        visited.add(stateStr);

        for (const { state: nextState, move } of getNeighbors(state)) {
            if (!visited.has(JSON.stringify(nextState))) {
                queue.push({ state: nextState, moves: [...currentMoves, move] });
            }
        }
    }

    const endTime = performance.now();
    return { moves: [], time: endTime - startTime, depth: -1 };
}

function dfs2DMatrix(startState, goalState, size) {
    const directions = ['left', 'right', 'up', 'down'];
    const directionVectors = {
        'left': [0, -1],
        'right': [0, 1],
        'up': [-1, 0],
        'down': [1, 0]
    };

    function getNeighbors(state) {
        const neighbors = [];
        const zeroIndex = state.flat().indexOf(0);
        const zeroRow = Math.floor(zeroIndex / size);
        const zeroCol = zeroIndex % size;

        for (const dir of directions) {
            const [dRow, dCol] = directionVectors[dir];
            const newRow = zeroRow + dRow;
            const newCol = zeroCol + dCol;

            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                const newState = JSON.parse(JSON.stringify(state));
                [newState[zeroRow][zeroCol], newState[newRow][newCol]] = [newState[newRow][newCol], newState[zeroRow][zeroCol]];
                neighbors.push({ state: newState, move: dir });
            }
        }

        return neighbors;
    }

    function dfs(state, currentMoves, depth, visited) {
        const stateStr = JSON.stringify(state);

        if (stateStr === JSON.stringify(goalState)) {
            return currentMoves;
        }

        if (depth === 0) {
            return null;
        }

        visited.add(stateStr);

        for (const { state: nextState, move } of getNeighbors(state)) {
            if (!visited.has(JSON.stringify(nextState))) {
                const result = dfs(nextState, [...currentMoves, move], depth - 1, visited);
                if (result) return result;
            }
        }

        return null;
    }

    const startTime = performance.now();
    let depth = 0;
    while (true) {
        const visited = new Set();
        const result = dfs(startState, [], depth, visited);
        if (result) {
            const endTime = performance.now();
            return { moves: result, time: endTime - startTime, depth };
        }
        depth++;
    }
}

function aStar2DMatrix(startState, goalState, size) {
    const directions = ['left', 'right', 'up', 'down'];
    const directionVectors = {
        'left': [0, -1],
        'right': [0, 1],
        'up': [-1, 0],
        'down': [1, 0]
    };

    function getNeighbors(state) {
        const neighbors = [];
        const zeroIndex = state.flat().indexOf(0);
        const zeroRow = Math.floor(zeroIndex / size);
        const zeroCol = zeroIndex % size;

        for (const dir of directions) {
            const [dRow, dCol] = directionVectors[dir];
            const newRow = zeroRow + dRow;
            const newCol = zeroCol + dCol;

            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                const newState = JSON.parse(JSON.stringify(state));
                [newState[zeroRow][zeroCol], newState[newRow][newCol]] = [newState[newRow][newCol], newState[zeroRow][zeroCol]];
                neighbors.push({ state: newState, move: dir });
            }
        }

        return neighbors;
    }

    function heuristic(state) {
        let distance = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const tile = state[row][col];
                if (tile !== 0) {
                    const goalRow = Math.floor((tile - 1) / size);
                    const goalCol = (tile - 1) % size;
                    distance += Math.abs(goalRow - row) + Math.abs(goalCol - col);
                }
            }
        }
        return distance;
    }

    const startTime = performance.now();
    const openSet = [{ state: startState, moves: [], cost: 0 }];
    const cameFrom = new Map();
    const costSoFar = new Map();
    const goalStr = JSON.stringify(goalState);

    costSoFar.set(JSON.stringify(startState), 0);

    while (openSet.length > 0) {
        openSet.sort((a, b) => (a.cost + heuristic(a.state)) - (b.cost + heuristic(b.state)));
        const { state, moves: currentMoves, cost } = openSet.shift();
        const stateStr = JSON.stringify(state);

        if (stateStr === goalStr) {
            const endTime = performance.now();
            return { moves: currentMoves, time: endTime - startTime, depth: currentMoves.length };
        }

        for (const { state: nextState, move } of getNeighbors(state)) {
            const nextStateStr = JSON.stringify(nextState);
            const newCost = cost + 1;

            if (!costSoFar.has(nextStateStr) || newCost < costSoFar.get(nextStateStr)) {
                costSoFar.set(nextStateStr, newCost);
                openSet.push({ state: nextState, moves: [...currentMoves, move], cost: newCost });
                cameFrom.set(nextStateStr, stateStr);
            }
        }
    }

    const endTime = performance.now();
    return { moves: [], time: endTime - startTime, depth: -1 };
}

function idfs2DMatrix(startState, goalState, size) {
    const directions = ['left', 'right', 'up', 'down'];
    const directionVectors = {
        'left': [0, -1],
        'right': [0, 1],
        'up': [-1, 0],
        'down': [1, 0]
    };

    function getNeighbors(state) {
        const neighbors = [];
        const zeroIndex = state.flat().indexOf(0);
        const zeroRow = Math.floor(zeroIndex / size);
        const zeroCol = zeroIndex % size;

        for (const dir of directions) {
            const [dRow, dCol] = directionVectors[dir];
            const newRow = zeroRow + dRow;
            const newCol = zeroCol + dCol;

            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                const newState = JSON.parse(JSON.stringify(state));
                [newState[zeroRow][zeroCol], newState[newRow][newCol]] = [newState[newRow][newCol], newState[zeroRow][zeroCol]];
                neighbors.push({ state: newState, move: dir });
            }
        }

        return neighbors;
    }

    function dfs(state, currentMoves, depth, visited) {
        const stateStr = JSON.stringify(state);

        if (stateStr === JSON.stringify(goalState)) {
            return currentMoves;
        }

        if (depth === 0) {
            return null;
        }

        visited.add(stateStr);

        for (const { state: nextState, move } of getNeighbors(state)) {
            if (!visited.has(JSON.stringify(nextState))) {
                const result = dfs(nextState, [...currentMoves, move], depth - 1, visited);
                if (result) return result;
            }
        }

        return null;
    }

    const startTime = performance.now();
    let depth = 0;
    while (true) {
        const visited = new Set();
        const result = dfs(startState, [], depth, visited);
        if (result) {
            const endTime = performance.now();
            return { moves: result, time: endTime - startTime, depth };
        }
        depth++;
    }
}
function idaStar2DMatrix(startState, goalState, size) {
    const directions = ['left', 'right', 'up', 'down'];
    const directionVectors = {
        'left': [0, -1],
        'right': [0, 1],
        'up': [-1, 0],
        'down': [1, 0]
    };

    function getNeighbors(state) {
        const neighbors = [];
        const zeroIndex = state.flat().indexOf(0);
        const zeroRow = Math.floor(zeroIndex / size);
        const zeroCol = zeroIndex % size;

        for (const dir of directions) {
            const [dRow, dCol] = directionVectors[dir];
            const newRow = zeroRow + dRow;
            const newCol = zeroCol + dCol;

            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                const newState = JSON.parse(JSON.stringify(state));
                [newState[zeroRow][zeroCol], newState[newRow][newCol]] = [newState[newRow][newCol], newState[zeroRow][zeroCol]];
                neighbors.push({ state: newState, move: dir });
            }
        }

        return neighbors;
    }

    function heuristic(state) {
        let distance = 0;
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const tile = state[row][col];
                if (tile !== 0) {
                    const goalRow = Math.floor((tile - 1) / size);
                    const goalCol = (tile - 1) % size;
                    distance += Math.abs(goalRow - row) + Math.abs(goalCol - col);
                }
            }
        }
        return distance;
    }

    function search(state, g, bound, path, moves) {
        const f = g + heuristic(state);
        if (f > bound) return f;
        if (JSON.stringify(state) === JSON.stringify(goalState)) return 0;

        let min = Infinity;
        for (const { state: nextState, move } of getNeighbors(state)) {
            const nextStateStr = JSON.stringify(nextState);
            if (!path.has(nextStateStr)) {
                path.add(nextStateStr);
                moves.push(move);
                const t = search(nextState, g + 1, bound, path, moves);
                if (t === 0) {
                    return t;
                }
                if (t < min) {
                    min = t;
                }
                path.delete(nextStateStr);
                moves.pop();
            }
        }

        return min;
    }

    const startTime = performance.now();
    let bound = heuristic(startState);
    let path = new Set();
    let moves = [];
    path.add(JSON.stringify(startState));

    while (true) {
        const result = search(startState, 0, bound, path, moves);
        if (result === 0) {
            const endTime = performance.now();
            return { moves, time: endTime - startTime, depth: bound };
        }
        if (result === Infinity) {
            const endTime = performance.now();
            return { moves: [], time: endTime - startTime, depth: -1 };
        }
        bound = result;
    }
}




