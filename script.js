class TextScramble {
    constructor(element) {
        this.el = element;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));

        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span>${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        const randomIndex = Math.floor(Math.random() * this.chars.length);
        return this.chars[randomIndex];
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const phrases = [
        'HELLO FRIEND',
        'ACCESS GRANTED',
        'INITIATING...',
        'DARK MODE',
        'SYSTEM ONLINE',
        'WELCOME BACK'
    ];

    const textContainers = document.querySelectorAll('.text-container');
    const scrambleEffects = [];

    textContainers.forEach(function(container) {
        const textElement = container.querySelector('h2');
        const scrambleButton = container.querySelector('.scramble-btn');
        const textEffect = new TextScramble(textElement);
        
        scrambleEffects.push({ 
            element: textElement, 
            effect: textEffect 
        });

        scrambleButton.addEventListener('click', function() {
            const originalText = textElement.getAttribute('data-value');
            textEffect.setText(originalText);
        });
    });

    const scrambleAllButton = document.getElementById('scramble-all-btn');
    scrambleAllButton.addEventListener('click', function() {
        scrambleEffects.forEach(function(item) {
            const originalText = item.element.getAttribute('data-value');
            item.effect.setText(originalText);
        });
    });

    const randomTextButton = document.getElementById('random-text-btn');
    let phraseIndex = 0;
    randomTextButton.addEventListener('click', function() {
        const nextPhrase = phrases[phraseIndex];
        scrambleEffects.forEach(function(item) {
            item.effect.setText(nextPhrase);
        });
        phraseIndex = (phraseIndex + 1) % phrases.length;
    });
    
    const speedButtons = document.querySelectorAll('.speed-btn');
    speedButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const speedMode = button.getAttribute('data-speed');
            alert(`Speed control is not fully implemented. Selected mode: ${speedMode}`);
        });
    });
});
