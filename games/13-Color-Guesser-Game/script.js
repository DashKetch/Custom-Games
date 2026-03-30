        // --- Background Image Switching JavaScript ---
        document.addEventListener('DOMContentLoaded', (event) => {
            const backgroundContainer = document.getElementById('background-container');
            const imageOneClass = 'background-image-one';
            const imageTwoClass = 'background-image-two';

            // Function to switch the background class
            function switchBackground() {
                if (backgroundContainer.classList.contains(imageOneClass)) {
                    backgroundContainer.classList.remove(imageOneClass);
                    backgroundContainer.classList.add(imageTwoClass);
                } else {
                    backgroundContainer.classList.remove(imageTwoClass);
                    backgroundContainer.classList.add(imageOneClass);
                }
            }

            // Switch the background every minute (60000ms)
            setInterval(switchBackground, 60000);
        });

        // --- Original Game Logic JavaScript ---
        var numSquares = 6;
        var colors = [];
        var pickedColor;
        var score = 0;
        
        var squares = document.querySelectorAll(".square");
        var colorDisplay = document.getElementById("colorDisplay");
        var messageDisplay = document.getElementById("message");
        var h1 = document.querySelector("h1");
        var resetButton = document.getElementById("reset");
        var scoreDisplay = document.getElementById("score");
        var difficultyDropdown = document.getElementById("selectDifficulty");
        
        init();
        
        function init() {
            setupSquares();
            setupDifficultyDropdown(); 
            reset();
        }

        function setupDifficultyDropdown() {
            difficultyDropdown.addEventListener("change", function() {
                var selectedOption = this.options[this.selectedIndex];
                numSquares = parseInt(selectedOption.getAttribute("data-squares")); 
                if (!isNaN(numSquares)) {
                    reset();
                }
                score = 0;
                scoreDisplay.textContent = "Score: " + score;
            });
        }
        
        function setupSquares() {
            for (var i = 0; i < squares.length; i++) {
                squares[i].addEventListener("click", function() {
                    var clickedColor = this.style.backgroundColor;
                    if (clickedColor === pickedColor) {
                        messageDisplay.textContent = "Correct!";
                        resetButton.textContent = "Play Again?";
                        changeColors(clickedColor);
                        h1.style.backgroundColor = clickedColor;
                        score++;
                        scoreDisplay.textContent = "Score: " + score;
                    } else {
                        this.style.backgroundColor = "#232323";
                        messageDisplay.textContent = "Try Again";
                        if (score > 0) { 
                            score--; 
                        }
                        scoreDisplay.textContent = "Score: " + score;
                    }
                });
            }
        }
        
        function reset() {
            colors = generateRandomColors(numSquares);
            pickedColor = pickColor();
            colorDisplay.textContent = pickedColor;
            messageDisplay.textContent = "";
            resetButton.textContent = "New Colors";
            
            for (var i = 0; i < squares.length; i++) {
                if (i < numSquares) {
                    squares[i].style.display = "block";
                    squares[i].style.backgroundColor = colors[i];
                } else {
                    squares[i].style.display = "none";
                }
            }
            h1.style.backgroundColor = "steelblue";
        }
        
        resetButton.addEventListener("click", function() {
            reset();
        });
        
        function changeColors(color) {
            for (var i = 0; i < squares.length; i++) {
                if (squares[i].style.display !== "none") {
                    squares[i].style.backgroundColor = color;
                }
            }
        }
        
        function pickColor() {
            var random = Math.floor(Math.random() * colors.length);
            return colors[random];
        }
        
        function generateRandomColors(num) {
            var arr = [];
            for (var i = 0; i < num; i++) {
                arr.push(randomColor());
            }
            return arr;
        }
        
        function randomColor() {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }