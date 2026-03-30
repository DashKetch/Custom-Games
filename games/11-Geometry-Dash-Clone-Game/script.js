        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const startGameBtn = document.getElementById('startGameBtn');
        const toggleEditorBtn = document.getElementById('toggleEditorBtn');
        const obstacleTypeSelect = document.getElementById('obstacleTypeSelect');
        const exportLevelBtn = document.getElementById('exportLevelBtn');
        const importLevelBtn = document.getElementById('importLevelBtn');
        const levelDataInput = document.getElementById('levelDataInput');

        let isGameRunning = false;
        let isEditorMode = false;
        let animationFrameId = null;
        let cameraOffsetX = 0; // NEW: Tracks camera scroll position in editor mode

        let player = {
            x: 50,
            y: 0,
            width: 20,
            height: 20,
            velocityY: 0,
            gravity: 0.8,
            jumpForce: -15,
            grounded: true,
            color: 'yellow'
        };
        let obstacles = []; 
        const obstacleSpeed = 5;
        const obstacleWidth = 30;
        const obstacleHeight = 30;
        const groundHeight = 20;
        const editorScrollSpeed = 15; // Speed for A/D movement

        const defaultLevelData = [
            { x: 400, y: canvas.height - groundHeight - 15, type: 'spike' },
            { x: 600, y: canvas.height - groundHeight - 15, type: 'spike' },
            { x: 800, y: canvas.height - groundHeight - 30, type: 'block' },
            { x: 950, y: canvas.height - groundHeight - 15, type: 'spike' },
            { x: 1100, y: canvas.height - groundHeight - 30, type: 'block' },
            { x: 1250, y: canvas.height - groundHeight - 30, type: 'block' },
            { x: 1400, y: canvas.height - groundHeight - 15, type: 'spike' },
            { x: 1600, y: canvas.height - groundHeight - 30, type: 'block' },
        ];
        
        let currentLevelDesign = JSON.parse(JSON.stringify(defaultLevelData)); 

        // --- Core Game Functions ---

        function initGame() {
            obstacles = JSON.parse(JSON.stringify(currentLevelDesign)); 
            player.y = canvas.height - groundHeight - player.height;
            player.velocityY = 0;
            player.grounded = true;
            startGameBtn.textContent = 'Restart Game';
            cameraOffsetX = 0; // Reset camera when starting/restarting game
        }

        function drawGround() {
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
        }

        function drawPlayer() {
            ctx.fillStyle = player.color;
            // Draw player at a fixed X position in game mode
            // In editor mode, draw relative to the camera offset
            const drawX = isEditorMode ? player.x - cameraOffsetX : player.x;
            ctx.fillRect(drawX, player.y, player.width, player.height);
        }

        function applyPlayerPhysics() {
            if (!player.grounded) {
                player.velocityY += player.gravity;
            }
            player.y += player.velocityY;
            
            if (player.y + player.height >= canvas.height - groundHeight) {
                player.y = canvas.height - groundHeight - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }
        }

        function jump() {
            if (isGameRunning && !isEditorMode && player.grounded) {
                player.velocityY = player.jumpForce;
                player.grounded = false;
            }
        }

        function drawObstacles() {
            obstacles.forEach(obstacle => {
                // Adjust drawing X based on game movement or editor camera offset
                const drawX = isGameRunning && !isEditorMode ? obstacle.x : obstacle.x - cameraOffsetX;

                if (obstacle.type === 'spike') {
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.moveTo(drawX + obstacleWidth / 2, obstacle.y);
                    ctx.lineTo(drawX, obstacle.y + obstacleHeight);
                    ctx.lineTo(drawX + obstacleWidth, obstacle.y + obstacleHeight);
                    ctx.closePath();
                    ctx.fill();
                } else if (obstacle.type === 'block') {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(drawX, obstacle.y, obstacleWidth, obstacleHeight);
                }
            });
        }

        function updateObstaclesMovement() {
             for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].x -= obstacleSpeed; 
                if (obstacles[i].x + obstacleWidth < 0) {
                    obstacles.splice(i, 1);
                }
            }
        }

        function checkCollisions() {
            let onBlock = false;
            for (const obstacle of obstacles) {
                
                const collides = (
                    player.x < obstacle.x + obstacleWidth &&
                    player.x + player.width > obstacle.x &&
                    player.y < obstacle.y + obstacleHeight &&
                    player.y + player.height > obstacle.y
                );

                if (collides) {
                    if (obstacle.type === 'spike') {
                        gameOver();
                        return true;
                    } else if (obstacle.type === 'block') {
                        const prevPlayerBottom = player.y + player.height - player.velocityY;
                        
                        if (prevPlayerBottom <= obstacle.y && player.y + player.height >= obstacle.y) {
                            player.y = obstacle.y - player.height;
                            player.velocityY = 0;
                            player.grounded = true;
                            onBlock = true;
                        } else {
                            gameOver();
                            return true;
                        }
                    }
                }
            }
            if (!onBlock && player.y + player.height < canvas.height - groundHeight) {
                player.grounded = false;
            }
            return false;
        }

        function gameOver() {
            isGameRunning = false;
            cancelAnimationFrame(animationFrameId);
            alert('Game Over!');
            initGame();
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGround();
            
            if (isGameRunning && !isEditorMode) {
                applyPlayerPhysics();
                updateObstaclesMovement();
                checkCollisions();
            } else if (isEditorMode) {
                // No movement updates to world coords in editor mode, just camera movement handled by keydown listener
            }

            drawObstacles();
            drawPlayer();

            animationFrameId = requestAnimationFrame(gameLoop);
        }

        // --- Editor Mode Functions ---

        function toggleEditor() {
            isEditorMode = !isEditorMode;
            isGameRunning = false;

            if (isEditorMode) {
                toggleEditorBtn.textContent = 'Toggle Editor (On)';
                obstacleTypeSelect.style.display = 'inline-block';
                levelDataInput.style.display = 'block';
                canvas.addEventListener('click', handleCanvasClick); 
                obstacles = JSON.parse(JSON.stringify(currentLevelDesign)); 
                cameraOffsetX = 0; // Start camera at the beginning of the level in editor mode
            } else {
                toggleEditorBtn.textContent = 'Toggle Editor (Off)';
                obstacleTypeSelect.style.display = 'none';
                levelDataInput.style.display = 'none';
                canvas.removeEventListener('click', handleCanvasClick);
                initGame(); 
            }
        }

        function handleCanvasClick(event) {
            const rect = canvas.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const clickY = event.clientY - rect.top;
            const type = obstacleTypeSelect.value;
            
            // CRITICAL CHANGE: Calculate the actual world X coordinate by adding the camera offset
            const worldClickX = clickX + cameraOffsetX; 

            if (type === 'delete') {
                for (let i = currentLevelDesign.length - 1; i >= 0; i--) {
                    const obs = currentLevelDesign[i];
                    // Use worldClickX to check collision with existing obstacles
                    if (
                        worldClickX >= obs.x && 
                        worldClickX <= obs.x + obstacleWidth && 
                        clickY >= obs.y && 
                        clickY <= obs.y + obstacleHeight
                    ) {
                        currentLevelDesign.splice(i, 1);
                        break;
                    }
                }
            } else {
                // Place a new obstacle using the world X coordinate
                const newObstacle = {
                    x: Math.floor(worldClickX / 10) * 10, // Snap world coordinates
                    y: Math.floor(clickY / 10) * 10,
                    type: type
                };
                currentLevelDesign.push(newObstacle);
            }
            
            obstacles = JSON.parse(JSON.stringify(currentLevelDesign));
        }

        function exportLevel() {
            levelDataInput.value = JSON.stringify(currentLevelDesign, null, 2);
            levelDataInput.select();
        }

        function importLevel() {
            try {
                const importedData = JSON.parse(levelDataInput.value);
                if (Array.isArray(importedData)) {
                    currentLevelDesign = importedData;
                    obstacles = JSON.parse(JSON.stringify(currentLevelDesign));
                    alert('Level imported successfully!');
                } else {
                    alert('Invalid JSON format for level data. Must be an array.');
                }
            } catch (error) {
                alert('Failed to parse JSON data. Check console for details.');
                console.error(error);
            }
        }

        // --- Event Listeners ---

        startGameBtn.addEventListener('click', () => {
            if (!isGameRunning) {
                isGameRunning = true;
                isEditorMode = false;
                toggleEditorBtn.textContent = 'Toggle Editor (Off)';
                initGame();
            }
        });

        toggleEditorBtn.addEventListener('click', toggleEditor);
        exportLevelBtn.addEventListener('click', exportLevel);
        importLevelBtn.addEventListener('click', importLevel);

        document.addEventListener('keydown', (e) => {
            if (isGameRunning && !isEditorMode) {
                // Jump controls for game mode
                if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
                    jump();
                }
            } else if (isEditorMode) {
                // Editor movement controls
                if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                    cameraOffsetX -= editorScrollSpeed;
                    if (cameraOffsetX < 0) cameraOffsetX = 0; // Prevent scrolling before X=0
                } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                    cameraOffsetX += editorScrollSpeed;
                }
            }
        });

        canvas.addEventListener('click', () => {
            if (isGameRunning && !isEditorMode) {
                jump();
            }
        });

        // Initialize
        initGame();
        gameLoop(); 