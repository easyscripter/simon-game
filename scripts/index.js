const app = new Vue({
    el: '#app',
    data: () => {
        return {
            difficultyLevel: 'easy',
            round: 0,
            sequence: [],
            buttons: ['green', 'blue', 'yellow', 'red'],
            btn: 'btn',
            userSequence: [],
            sounds: [
                new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
                new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
                new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
                new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
            ],
            clickTimeArray: [],
        }
    },
    methods: {
        clickHandler(btnIndex) {
            this.$refs.button[btnIndex].classList.add('btn-clicked');
            this.sounds[btnIndex].play();

            const index = this.userSequence.push(btnIndex) - 1;

            this.clickTimeArray.push(new Date().getSeconds());

            if (this.userSequence[index] !== this.sequence[index]) {
                alert(`Вы проиграли, пройдя: ${this.round} раундов`);
                this.$refs.button[btnIndex].classList.remove('btn-clicked');
                this.reset();
                return;
            }


            if (this.userSequence.length === this.sequence.length) {
                this.userSequence = [];
                setInterval(() => {
                    this.$refs.button[btnIndex].classList.remove('btn-clicked');
                }, 200);

                setTimeout(() => {
                    for (let i = 0; i < this.clickTimeArray.length; i++) {
                        if (this.difficultyLevel === 'easy' && (this.clickTimeArray[i + 1] - this.clickTimeArray[i]) > 1.5) {
                            alert(`Ваше время вышло! Вы проиграли, пройдя: ${this.round} раундов`);
                            this.$refs.button[btnIndex].classList.remove('btn-clicked');
                            this.reset();
                            break;
                        } else if (this.difficultyLevel === 'normal' && (this.clickTimeArray[i + 1] - this.clickTimeArray[i]) > 1) {
                            alert(`Ваше время вышло! Вы проиграли, пройдя: ${this.round} раундов`);
                            this.$refs.button[btnIndex].classList.remove('btn-clicked');
                            this.reset();
                            break;
                        } else if (this.difficultyLevel === 'hard' && (this.clickTimeArray[i + 1] - this.clickTimeArray[i]) > 0.4) {
                            alert(`Ваше время вышло! Вы проиграли, пройдя: ${this.round} раундов`);
                            this.$refs.button[btnIndex].classList.remove('btn-clicked');
                            this.reset();
                            break;
                        } else {
                            this.clickTimeArray = [];
                            this.generateNewRound();
                            return;
                        }
                    }

                }, 1000);
                return;
            }
        },
        startGame() {
            this.reset();
            this.generateNewRound();
        },
        reset() {
            this.round = 0;
            this.sequence = [];
            this.userSequence = [];
            this.timeClicking = 0;
            this.clickTimeArray = [];
        },
        async generateNewRound() {
            this.round += 1;
            const idx = this.generateNewIndex();
            this.sequence.push(idx);

            for (const index of this.sequence) {
                await this.activateTile(index);
            }
        },
        generateNewIndex() {
            return Math.floor(Math.random() * (3 - 0 + 1)) + 0;
        },

        activateTile(index) {
            return new Promise((resolve, reject) => {
                this.$refs.button[index].classList.add('illumination');
                this.sounds[index].play();
                setTimeout(() => {
                    this.$refs.button[index].classList.remove('illumination');
                    setTimeout(() => {
                        resolve();
                    }, 500);
                }, 1000)
            });
        }
    },
});