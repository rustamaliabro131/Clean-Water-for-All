/* ============================================
   Snake Game Engine — Water Guardian
   ============================================ */

const WaterSnakeGame = (() => {
    // DOM refs
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('scoreDisplay');
    const litersEl = document.getElementById('litersDisplay');
    const startOverlay = document.getElementById('startOverlay');
    const gameOverModal = document.getElementById('gameOverModal');
    const finalScoreEl = document.getElementById('finalScoreText');
    const finalLitersEl = document.getElementById('finalLitersText');
    const hudHighScoreEl = document.getElementById('hudHighScore');
    const hudLevelEl = document.getElementById('hudLevel');
    const btnStart = document.getElementById('btnStartGame');
    const btnAddToWallet = document.getElementById('btnAddToWallet');
    const btnPlayAgain = document.getElementById('btnPlayAgain');

    // Game config
    const GRID_SIZE = 20;
    const CANVAS_SIZE = 600;
    const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;
    const BASE_SPEED = 100;
    const MIN_SPEED = 50;
    const SPEED_INCREMENT = 5;
    const POINTS_PER_DROP = 10;
    const SPEED_UP_INTERVAL = 50; // speed up every 50 points

    // Levels
    const LEVELS = [
        { name: 'Amazonia', min: 0 },
        { name: 'Sahara Springs', min: 100 },
        { name: 'Himalayan Peaks', min: 250 },
        { name: 'Pacific Depths', min: 500 },
        { name: 'Arctic Glacier', min: 800 }
    ];

    // State
    let snake = [];
    let food = { x: 0, y: 0 };
    let dirtyFood = { x: -1, y: -1 };
    let dirtyFoodTimer = null;
    let dx = 1;
    let dy = 0;
    let score = 0;
    let speed = BASE_SPEED;
    let isRunning = false;
    let isGameOver = false;
    let gameLoop = null;
    let highScore = 0;
    let currentLevel = 0;

    // Callback for when game ends (score to add to wallet)
    let onGameEnd = null;

    function init() {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        setupControls();
        setupButtons();
        // Draw initial idle state on canvas
        clearCanvas();
        drawGrid();
    }

    function resizeCanvas() {
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
    }

    function setupControls() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (!isRunning) return;
            const key = e.key;
            switch (key) {
                case 'ArrowUp': case 'w': case 'W':
                    e.preventDefault(); changeDir('up'); break;
                case 'ArrowDown': case 's': case 'S':
                    e.preventDefault(); changeDir('down'); break;
                case 'ArrowLeft': case 'a': case 'A':
                    e.preventDefault(); changeDir('left'); break;
                case 'ArrowRight': case 'd': case 'D':
                    e.preventDefault(); changeDir('right'); break;
            }
        });

        // Mobile D-Pad
        document.querySelectorAll('.dpad-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!isRunning) return;
                changeDir(btn.dataset.dir);
            });
            // Prevent double-tap zoom on mobile
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (!isRunning) return;
                changeDir(btn.dataset.dir);
            });
        });
    }

    function setupButtons() {
        btnStart.addEventListener('click', startGame);
        btnPlayAgain.addEventListener('click', startGame);
        btnAddToWallet.addEventListener('click', () => {
            if (onGameEnd) onGameEnd(score);
            hideGameOver();
        });
    }

    function startGame() {
        score = 0;
        dx = 1;
        dy = 0;
        speed = BASE_SPEED;
        isRunning = true;
        isGameOver = false;
        currentLevel = 0;

        // Reset snake at center
        const startY = Math.floor(TILE_COUNT / 2);
        snake = [
            { x: Math.floor(TILE_COUNT / 2), y: startY },
            { x: Math.floor(TILE_COUNT / 2) - 1, y: startY },
            { x: Math.floor(TILE_COUNT / 2) - 2, y: startY }
        ];

        updateUI();
        updateLevel();
        spawnFood();
        spawnDirtyFood();
        hideStartOverlay();
        hideGameOver();

        if (gameLoop) clearTimeout(gameLoop);
        runLoop();
    }

    function runLoop() {
        if (!isRunning || isGameOver) return;

        advanceSnake();

        if (checkBoundaryCollision() || checkSelfCollision()) {
            endGame();
            return;
        }

        if (checkDirtyFoodCollision()) {
            endGame();
            return;
        }

        clearCanvas();
        drawGrid();
        drawDirtyFood();
        drawFood();
        drawSnake();
        drawBoundaryWarning();

        gameLoop = setTimeout(runLoop, speed);
    }

    function advanceSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += POINTS_PER_DROP;
            updateUI();
            updateSpeed();
            updateLevel();
            spawnFood();
        } else if (head.x === dirtyFood.x && head.y === dirtyFood.y) {
            // Dirty water collision handled in runLoop
        } else {
            snake.pop();
        }
    }

    function checkBoundaryCollision() {
        const head = snake[0];
        return head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT;
    }

    function checkDirtyFoodCollision() {
        const head = snake[0];
        return head.x === dirtyFood.x && head.y === dirtyFood.y;
    }

    function updateUI() {
        scoreEl.textContent = score;
        litersEl.textContent = (score / 10).toFixed(1) + ' L';
    }

    function updateSpeed() {
        const newSpeed = BASE_SPEED - Math.floor(score / SPEED_UP_INTERVAL) * SPEED_INCREMENT;
        speed = Math.max(MIN_SPEED, newSpeed);
    }

    function updateLevel() {
        let lvl = 0;
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (score >= LEVELS[i].min) {
                lvl = i;
                break;
            }
        }
        if (lvl !== currentLevel) {
            currentLevel = lvl;
        }
        hudLevelEl.textContent = `Level ${currentLevel + 1}: ${LEVELS[currentLevel].name}`;
    }

    function checkSelfCollision() {
        const head = snake[0];
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) return true;
        }
        return false;
    }

    function changeDir(dir) {
        if (dir === 'up' && dy === 0) { dx = 0; dy = -1; }
        else if (dir === 'down' && dy === 0) { dx = 0; dy = 1; }
        else if (dir === 'left' && dx === 0) { dx = -1; dy = 0; }
        else if (dir === 'right' && dx === 0) { dx = 1; dy = 0; }
    }

    function spawnFood() {
        let valid = false;
        while (!valid) {
            food.x = Math.floor(Math.random() * TILE_COUNT);
            food.y = Math.floor(Math.random() * TILE_COUNT);
            valid = !snake.some(s => s.x === food.x && s.y === food.y)
                 && !(food.x === dirtyFood.x && food.y === dirtyFood.y);
        }
    }

    function spawnDirtyFood() {
        let valid = false;
        while (!valid) {
            dirtyFood.x = Math.floor(Math.random() * TILE_COUNT);
            dirtyFood.y = Math.floor(Math.random() * TILE_COUNT);
            valid = !snake.some(s => s.x === dirtyFood.x && s.y === dirtyFood.y)
                 && !(dirtyFood.x === food.x && dirtyFood.y === food.y);
        }

        // Dirty food disappears after a random time (4-8 seconds) then respawns elsewhere
        clearTimeout(dirtyFoodTimer);
        const vanishTime = 4000 + Math.floor(Math.random() * 4000);
        dirtyFoodTimer = setTimeout(() => {
            if (isRunning && !isGameOver) {
                spawnDirtyFood();
            }
        }, vanishTime);
    }

    // === Drawing ===

    function clearCanvas() {
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    function drawGrid() {
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, CANVAS_SIZE);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(CANVAS_SIZE, i);
            ctx.stroke();
        }
    }

    function drawSnake() {
        snake.forEach((part, index) => {
            const isHead = index === 0;
            const opacity = 1 - (index / snake.length) * 0.6;

            // Head glow
            if (isHead) {
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#93ccff';
            } else {
                ctx.shadowBlur = 0;
            }

            // Gradient color
            const grad = ctx.createLinearGradient(
                part.x * GRID_SIZE, part.y * GRID_SIZE,
                (part.x + 1) * GRID_SIZE, (part.y + 1) * GRID_SIZE
            );
            grad.addColorStop(0, `rgba(147, 204, 255, ${opacity})`);
            grad.addColorStop(1, `rgba(0, 97, 148, ${opacity})`);

            ctx.fillStyle = grad;

            // Draw circular node
            const r = isHead ? GRID_SIZE / 2 : GRID_SIZE / 3;
            const centerX = part.x * GRID_SIZE + GRID_SIZE / 2;
            const centerY = part.y * GRID_SIZE + GRID_SIZE / 2;

            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.fill();

            // Pipeline connecting lines
            if (index < snake.length - 1) {
                const next = snake[index + 1];
                ctx.shadowBlur = 0;
                ctx.strokeStyle = `rgba(147, 204, 255, ${opacity * 0.5})`;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    next.x * GRID_SIZE + GRID_SIZE / 2,
                    next.y * GRID_SIZE + GRID_SIZE / 2
                );
                ctx.stroke();
            }

            // Draw eyes on head
            if (isHead) {
                ctx.shadowBlur = 0;
                const eyeSize = 3;
                ctx.fillStyle = 'white';

                let eye1X, eye1Y, eye2X, eye2Y;
                if (dx === 1) { // right
                    eye1X = centerX + 4; eye1Y = centerY - 4;
                    eye2X = centerX + 4; eye2Y = centerY + 4;
                } else if (dx === -1) { // left
                    eye1X = centerX - 4; eye1Y = centerY - 4;
                    eye2X = centerX - 4; eye2Y = centerY + 4;
                } else if (dy === -1) { // up
                    eye1X = centerX - 4; eye1Y = centerY - 4;
                    eye2X = centerX + 4; eye2Y = centerY - 4;
                } else { // down
                    eye1X = centerX - 4; eye1Y = centerY + 4;
                    eye2X = centerX + 4; eye2Y = centerY + 4;
                }

                ctx.beginPath();
                ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.shadowBlur = 0;
    }

    function drawFood() {
        const centerX = food.x * GRID_SIZE + GRID_SIZE / 2;
        const centerY = food.y * GRID_SIZE + GRID_SIZE / 2;

        // Glow
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#57dffe';

        // Water drop shape using bezier curves
        ctx.fillStyle = '#57dffe';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - GRID_SIZE / 2.5);
        ctx.bezierCurveTo(
            centerX + GRID_SIZE / 2.5, centerY,
            centerX + GRID_SIZE / 4, centerY + GRID_SIZE / 2.5,
            centerX, centerY + GRID_SIZE / 2.5
        );
        ctx.bezierCurveTo(
            centerX - GRID_SIZE / 4, centerY + GRID_SIZE / 2.5,
            centerX - GRID_SIZE / 2.5, centerY,
            centerX, centerY - GRID_SIZE / 2.5
        );
        ctx.fill();

        // Inner highlight
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(centerX - 2, centerY - 2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    function drawDirtyFood() {
        if (dirtyFood.x < 0 || dirtyFood.y < 0) return;

        const centerX = dirtyFood.x * GRID_SIZE + GRID_SIZE / 2;
        const centerY = dirtyFood.y * GRID_SIZE + GRID_SIZE / 2;

        // Pulsing glow effect
        const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
        ctx.shadowBlur = 18 * pulse;
        ctx.shadowColor = '#ff4444';

        // Red water drop shape
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - GRID_SIZE / 2.5);
        ctx.bezierCurveTo(
            centerX + GRID_SIZE / 2.5, centerY,
            centerX + GRID_SIZE / 4, centerY + GRID_SIZE / 2.5,
            centerX, centerY + GRID_SIZE / 2.5
        );
        ctx.bezierCurveTo(
            centerX - GRID_SIZE / 4, centerY + GRID_SIZE / 2.5,
            centerX - GRID_SIZE / 2.5, centerY,
            centerX, centerY - GRID_SIZE / 2.5
        );
        ctx.fill();

        // Skull/x mark on dirty drop
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('X', centerX, centerY + 1);

        ctx.shadowBlur = 0;
    }

    function drawBoundaryWarning() {
        const head = snake[0];
        if (!head) return;

        const margin = GRID_SIZE;
        const isNearBoundary = head.x <= 1 || head.x >= TILE_COUNT - 2
                            || head.y <= 1 || head.y >= TILE_COUNT - 2;

        if (isNearBoundary) {
            const pulse = Math.sin(Date.now() / 150) * 0.3 + 0.5;
            ctx.strokeStyle = `rgba(255, 68, 68, ${pulse})`;
            ctx.lineWidth = 4;
            ctx.strokeRect(2, 2, CANVAS_SIZE - 4, CANVAS_SIZE - 4);
        }
    }

    // === Overlays ===

    function hideStartOverlay() {
        startOverlay.style.display = 'none';
    }

    function showStartOverlay() {
        startOverlay.style.display = 'flex';
    }

    function hideGameOver() {
        gameOverModal.classList.add('hidden');
    }

    function endGame() {
        isRunning = false;
        isGameOver = true;
        clearTimeout(gameLoop);
        clearTimeout(dirtyFoodTimer);
        dirtyFood = { x: -1, y: -1 };

        // Update high score
        if (score > highScore) {
            highScore = score;
        }

        hudHighScoreEl.textContent = `High: ${highScore}`;
        finalScoreEl.textContent = `${score} Points`;
        finalLitersEl.textContent = `${(score / 10).toFixed(1)} Liters`;

        gameOverModal.classList.remove('hidden');
    }

    function setOnGameEnd(callback) {
        onGameEnd = callback;
    }

    function setHighScore(val) {
        highScore = val;
        hudHighScoreEl.textContent = `High: ${highScore}`;
    }

    function destroy() {
        isRunning = false;
        clearTimeout(gameLoop);
    }

    return {
        init,
        setOnGameEnd,
        setHighScore,
        destroy
    };
})();
