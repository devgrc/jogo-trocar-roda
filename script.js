document.addEventListener('DOMContentLoaded', function() {
    // Passos por nível de dificuldade
    const stepsByDifficulty = {
        easy: [
            "Estacione em um lugar seguro e acione o freio de mão.",
            "Pegue o estepe e as ferramentas.",
            "Afrouxe os parafusos da roda.",
            "Use o macaco para levantar o carro.",
            "Tire a roda furada e coloque o estepe.",
            "Abaixe o carro e aperte os parafusos.",
            "Guarde tudo e siga viagem."
        ],
        medium: [
            "Pare em um local seguro, acione o freio de mão e coloque o triângulo de segurança.",
            "Pegue o estepe, a chave de roda e o macaco.",
            "Afrouxe os parafusos da roda antes de levantar o carro.",
            "Posicione o macaco no ponto certo e levante o carro.",
            "Retire a roda furada.",
            "Coloque o estepe e alinhe os furos com os parafusos.",
            "Aperte os parafusos com a mão.",
            "Abaixe o carro e finalize apertando os parafusos com força.",
            "Guarde a roda furada e os equipamentos.",
            "Recolha o triângulo de segurança e continue sua viagem."
        ],
        hard: [
            "Estacione o carro em local seguro e plano, acione o freio de mão",
            "Coloque o triângulo de segurança a uma distância adequada do veículo",
            "Pegue o estepe e as ferramentas do porta-malas",
            "Afrouxe ligeiramente os parafusos da roda (sem retirá-los completamente)",
            "Posicione o macaco no local indicado pelo manual do veículo",
            "Levante o carro com o macaco até a roda ficar suspensa",
            "Remova completamente os parafusos e depois a roda",
            "Coloque o estepe no lugar da roda removida",
            "Aperte os parafusos manualmente o máximo que conseguir",
            "Abaixe o carro com o macaco até o estepe tocar o chão",
            "Aperte os parafusos com a chave em formato de estrela (cruzeta)",
            "Guarde a roda furada e as ferramentas no porta-malas",
            "Recolha o triângulo de segurança e continue sua viagem."
        ]
    };
    
    // Configurações de dificuldade
    const difficultySettings = {
        easy: {
            hintCount: 5
        },
        medium: {
            hintCount: 3
        },
        hard: {
            hintCount: 2
        }
    };
    
    // Elementos do DOM
    const stepsContainer = document.getElementById('stepsContainer');
    const checkButton = document.getElementById('checkButton');
    const hintButton = document.getElementById('hintButton');
    const resetButton = document.getElementById('resetButton');
    const feedback = document.getElementById('feedback');
    const timerElement = document.getElementById('timer');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    
    // Variáveis do jogo
    let currentDifficulty = 'easy';
    let correctSteps = [];
    let shuffledSteps = [];
    let startTime = null;
    let timerInterval = null;
    let hintsRemaining = difficultySettings[currentDifficulty].hintCount;
    let gameActive = false;
    
    // Inicializar o jogo
    function initGame() {
        // Parar timer anterior se existir
        if (timerInterval) clearInterval(timerInterval);
        
        // Definir passos corretos baseado na dificuldade
        correctSteps = [...stepsByDifficulty[currentDifficulty]];
        
        // Embaralhar os passos
        shuffledSteps = [...correctSteps];
        for (let i = shuffledSteps.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSteps[i], shuffledSteps[j]] = [shuffledSteps[j], shuffledSteps[i]];
        }
        
        // Limpar o container
        stepsContainer.innerHTML = '';
        
        // Adicionar os passos embaralhados
        shuffledSteps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            stepElement.textContent = step;
            stepElement.draggable = true;
            stepElement.dataset.step = step;
            
            // Eventos de arrastar
            stepElement.addEventListener('dragstart', dragStart);
            stepElement.addEventListener('dragend', dragEnd);
            
            stepsContainer.appendChild(stepElement);
        });
        
        // Configurar eventos de soltar
        stepsContainer.addEventListener('dragover', dragOver);
        stepsContainer.addEventListener('drop', drop);
        stepsContainer.addEventListener('dragenter', dragEnter);
        stepsContainer.addEventListener('dragleave', dragLeave);
        
        // Resetar feedback
        feedback.style.display = 'none';
        
        // Atualizar dicas
        hintsRemaining = difficultySettings[currentDifficulty].hintCount;
        hintButton.textContent = `Dica (${hintsRemaining})`;
        hintButton.disabled = false;
        
        // Iniciar timer
        startTime = Date.now();
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
        
        gameActive = true;
    }
    
    // Atualizar o timer
    function updateTimer() {
        if (!startTime) return;
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        
        timerElement.textContent = `${minutes}:${seconds}`;
    }
    
    // Drag and Drop
    let draggedItem = null;
    let placeholder = document.createElement('div');
    placeholder.className = 'step-placeholder';
    
    function dragStart(e) {
        if (!gameActive) return;
        
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        
        // Criar placeholder
        placeholder.style.height = `${this.offsetHeight}px`;
    }
    
    function dragEnd() {
        this.classList.remove('dragging');
        placeholder.remove();
    }
    
    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const afterElement = getDragAfterElement(stepsContainer, e.clientY);
        
        if (afterElement) {
            stepsContainer.insertBefore(placeholder, afterElement);
        } else {
            stepsContainer.appendChild(placeholder);
        }
    }
    
    function dragEnter(e) {
        e.preventDefault();
    }
    
    function dragLeave() {
        // Não faz nada, mas necessário para o drag and drop funcionar
    }
    
    function drop(e) {
        if (!gameActive) return;
        e.preventDefault();
        if (draggedItem && placeholder.parentNode) {
            stepsContainer.insertBefore(draggedItem, placeholder);
        }
        placeholder.remove();
    }
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.step:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // Verificar resposta
    function checkAnswer() {
        if (!gameActive) return;
        
        const currentOrder = [...stepsContainer.querySelectorAll('.step')].map(el => el.dataset.step);
        const isCorrect = currentOrder.every((step, index) => step === correctSteps[index]);
        
        feedback.style.display = 'block';
        
        if (isCorrect) {
            // Parar o timer
            clearInterval(timerInterval);
            gameActive = false;
            
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            feedback.textContent = `✅ Parabéns! Você completou em ${elapsed} segundos!`;
            feedback.className = 'feedback success';
            
            // Efeito de confete
            createConfetti();
            
            // Efeito de onda verde
            stepsContainer.querySelectorAll('.step').forEach((step, i) => {
                setTimeout(() => {
                    step.style.transform = 'scale(1.05)';
                    step.style.backgroundColor = '#66bb6a';
                    setTimeout(() => {
                        step.style.transform = '';
                    }, 300);
                }, i * 100);
            });
            
            // Desabilitar botão de dica
            hintButton.disabled = true;
        } else {
            feedback.textContent = '❌ Ainda não está correto. Continue tentando!';
            feedback.className = 'feedback error';
        }
    }
    
    // Criar efeito de confete
    function createConfetti() {
        const container = document.querySelector('.game-container');
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(confetti);
            
            // Remover após a animação
            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }
    }
    
    // Sistema de dicas
    function giveHint() {
        if (!gameActive || hintsRemaining <= 0) return;
        
        const currentOrder = [...stepsContainer.querySelectorAll('.step')].map(el => el.dataset.step);
        const firstWrongIndex = currentOrder.findIndex((step, i) => step !== correctSteps[i]);
        
        if (firstWrongIndex >= 0) {
            // Encontrar o elemento que deveria estar nesta posição
            const correctStep = correctSteps[firstWrongIndex];
            const correctElement = [...stepsContainer.querySelectorAll('.step')].find(el => el.dataset.step === correctStep);
            
            if (correctElement) {
                // Destacar o elemento correto
                correctElement.classList.add('hint-active');
                
                // Remover o destaque após 3 segundos
                setTimeout(() => {
                    correctElement.classList.remove('hint-active');
                }, 3000);
                
                // Atualizar contador de dicas
                hintsRemaining--;
                hintButton.textContent = `Dica (${hintsRemaining})`;
                
                if (hintsRemaining <= 0) {
                    hintButton.disabled = true;
                }
            }
        }
    }
    
    // Event listeners
    checkButton.addEventListener('click', checkAnswer);
    hintButton.addEventListener('click', giveHint);
    resetButton.addEventListener('click', initGame);
    
    // Seleção de dificuldade
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDifficulty = this.dataset.level;
            initGame();
        });
    });
    
    // Iniciar o jogo
    initGame();
});