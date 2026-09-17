        const cardsData = [
            { id: 1, type: 'concept', text: 'IaaS (Infraestructura como Servicio)', category: 'Modelo de Servicio' },
            { id: 1, type: 'def', text: 'Provee recursos de cómputo, almacenamiento y redes virtualizadas (ej. AWS EC2).', category: 'Definición' },
            
            { id: 2, type: 'concept', text: 'PaaS (Plataforma como Servicio)', category: 'Modelo de Servicio' },
            { id: 2, type: 'def', text: 'Ofrece un entorno de desarrollo/despliegue sin gestionar servidores underlying.', category: 'Definición' },
            
            { id: 3, type: 'concept', text: 'SaaS (Software como Servicio)', category: 'Modelo de Servicio' },
            { id: 3, type: 'def', text: 'Aplicaciones completas listas para usar mediante navegador (ej. Microsoft 365).', category: 'Definición' },

            { id: 4, type: 'concept', text: 'Nube Híbrida', category: 'Modelo de Despliegue' },
            { id: 4, type: 'def', text: 'Combina infraestructura On-Premise (privada) con servicios de Nube Pública.', category: 'Definición' },

            { id: 5, type: 'concept', text: 'AWS IAM', category: 'Seguridad' },
            { id: 5, type: 'def', text: 'Servicio para gestionar usuarios, grupos y permisos bajo el menor privilegio.', category: 'Definición' },

            { id: 6, type: 'concept', text: 'AWS Budgets', category: 'Control Financiero' },
            { id: 6, type: 'def', text: 'Permite establecer presupuestos personalizados y alertas de costos estimados.', category: 'Definición' },

            { id: 7, type: 'concept', text: 'AWS CLI', category: 'Administración' },
            { id: 7, type: 'def', text: 'Herramienta de línea de comandos para automatizar y administrar servicios cloud.', category: 'Definición' },

            { id: 8, type: 'concept', text: 'John McCarthy (1961)', category: 'Evolución' },
            { id: 8, type: 'def', text: 'Pionero que conceptualizó la computación como un servicio público (Utility Computing).', category: 'Definición' }
        ];

        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let timer = null;
        let seconds = 0;
        let isGameStarted = false;

        function shuffle(array) {
            return array.sort(() => Math.random() - 0.5);
        }

        function formatTimer(sec) {
            const m = Math.floor(sec / 60).toString().padStart(2, '0');
            const s = (sec % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        function startTimer() {
            if (!isGameStarted) {
                isGameStarted = true;
                timer = setInterval(() => {
                    seconds++;
                    document.getElementById('timer').textContent = formatTimer(seconds);
                }, 1000);
            }
        }

        function stopTimer() {
            clearInterval(timer);
            isGameStarted = false;
        }

        function initGame() {
            stopTimer();
            seconds = 0;
            moves = 0;
            matchedPairs = 0;
            flippedCards = [];
            
            document.getElementById('timer').textContent = '00:00';
            document.getElementById('moves').textContent = '0';
            document.getElementById('matches').textContent = `0 / ${cardsData.length / 2}`;
            
            const grid = document.getElementById('grid');
            grid.innerHTML = '';

            const shuffledData = shuffle([...cardsData]);

            shuffledData.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.id = item.id;
                card.dataset.index = index;

                const badgeClass = item.type === 'concept' ? 'badge-concept' : 'badge-def';

                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-back"></div>
                        <div class="card-front">
                            <span class="card-tag ${badgeClass}">${item.category}</span>
                            <p class="card-text">${item.text}</p>
                        </div>
                    </div>
                `;

                card.addEventListener('click', () => flipCard(card));
                grid.appendChild(card);
            });
        }

        function flipCard(card) {
            if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
                return;
            }

            startTimer();

            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                moves++;
                document.getElementById('moves').textContent = moves;
                checkMatch();
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            const isMatch = card1.dataset.id === card2.dataset.id;

            if (isMatch) {
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                document.getElementById('matches').textContent = `${matchedPairs} / ${cardsData.length / 2}`;
                flippedCards = [];

                if (matchedPairs === cardsData.length / 2) {
                    stopTimer();
                    setTimeout(showVictory, 500);
                }
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                }, 1200);
            }
        }

        function showVictory() {
            document.getElementById('finalTime').textContent = formatTimer(seconds);
            document.getElementById('finalMoves').textContent = moves;
            document.getElementById('victoryModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('victoryModal').style.display = 'none';
            initGame();
        }

        initGame();

