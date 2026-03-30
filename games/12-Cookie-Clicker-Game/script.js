        let cookies = 0;
        let cps = 0;
        let clickPower = 1;
        
        let autoCost = 15;
        let sabotageCost = 50;

        // Manual click function
        function manualClick() {
            cookies += clickPower;
            updateDisplay();
        }

        function buyAutoClicker() {
            if (cookies >= autoCost) {
                cookies -= autoCost;
                cps += 1; // Increases cookies per second
                autoCost = Math.ceil(autoCost * 1.15);
                updateDisplay();
            }
        }

        function buySabotage() {
            if (cookies >= sabotageCost) {
                cookies -= sabotageCost;
                clickPower += 5; // Increases your manual click
                cps -= 2; // Subtracts from your total cookies every second
                sabotageCost = Math.ceil(sabotageCost * 1.5);
                updateDisplay();
            }
        }

        function updateDisplay() {
            document.getElementById('count').innerText = Math.floor(cookies);
            document.getElementById('cps-display').innerText = cps;
            document.getElementById('auto-cost').innerText = autoCost;
            document.getElementById('sabotage-cost').innerText = sabotageCost;
        }

        // Game Loop: Runs every 1 second
        setInterval(() => {
            cookies += cps;
            if (cookies < 0) cookies = 0; // Prevent negative cookies
            updateDisplay();
        }, 1000);