const Knight = "<img src='horse.png' class='img'/>";
const bishop = "<img src='bishop.png' class='img'/>";
const queen = "<img src='queen.png' class='img'/>";
const rook = "<img src='rook.png' class='img'/>";

const chessPeices = ["Q", "R", "B", "K"];

const chessWidth = 8;
const chessHeight = 8;
const chromosomeLength = 32;
const pCrossOver = 0.8;
const pMutation = 0.1;
const chromosomes = [];
const generations = [];
let numberOfChromosomes = 0;
let numberOfSelection = 0; // Add this variable
let heighestConflict = -1;
let leastConflict = -1;  // the value is -1 for debbuging

const generateD = document.createElement("div");
generateD.textContent = "Generating the generation 0 with random chromosomes";
generateD.classList.add("signs");

const selectionD = document.createElement("div");
selectionD.textContent = "Selecting two Parents of the chromosomes";
selectionD.classList.add("signs");

const crossOverD = document.createElement("div");
crossOverD.textContent = "Applying crossOver on the Parents";
crossOverD.classList.add("signs");

const offspringD = document.createElement("div");
offspringD.textContent = "Offspring is generated";
offspringD.classList.add("signs");

const mutationD = document.createElement("div");
mutationD.textContent = "Checking if mutation needed";
mutationD.classList.add("signs");

const chessBoard = document.createElement("div"); // The chessBoard
chessBoard.classList.add("chess-board");


// ChessBoard analyse 
const chessBoardAnalyse = document.createElement("div");
chessBoardAnalyse.classList.add("chessBaordAnalyse");


const currentConflictHolder = document.createElement("p");
const currentConflictDiffrence = document.createElement("p");

const chessAnalyserTitle = document.createElement("div");
chessAnalyserTitle.textContent = "Chess Board Satitcs";
chessAnalyserTitle.classList.add("analyseHeader");

chessBoardAnalyse.appendChild(chessAnalyserTitle);
chessBoardAnalyse.appendChild(currentConflictHolder);
chessBoardAnalyse.appendChild(currentConflictDiffrence);

const chessBoardHelper = document.createElement("div");
chessBoardHelper.classList.add("chessHelper");
chessBoardAnalyse.appendChild(chessBoardHelper);



const inputContainer = document.createElement("div");
inputContainer.classList.add("container");
const inputHolder = document.createElement("input");
inputHolder.classList.add("inputHolder");
inputHolder.placeholder = "The Number of Chromosomes that will be used";
const inputHolder2 = document.createElement("input");
inputHolder2.classList.add("inputHolder");
inputHolder2.placeholder = "The Number of Generations that will be used";
const inputTitle = document.createElement("h1");
inputTitle.textContent = "Create a chessBoard with genetic algorithm";

const submitButton = document.createElement("button");
submitButton.textContent = "Start simulation";
submitButton.classList.add("button-30");

inputContainer.appendChild(inputTitle);
inputContainer.appendChild(inputHolder);
inputContainer.appendChild(inputHolder2);
inputContainer.appendChild(submitButton);
document.body.appendChild(inputContainer);

const fitness = (nbrConflicts) => {
    return 1 / (1 + nbrConflicts); // Calculate fitness
};

const generateRandomPiece = () => {
    let randomPiece = Math.floor(Math.random() * chessPeices.length);
    return randomPiece;
};

const tranfromChoosenChromosome = (array) => {
    let lineBreak = false;
    for (let i = 0; i < array.length; i++) {
        if (lineBreak) {
            chessBoardHelper.innerHTML += "<br>";
            lineBreak = false;
        }
        chessBoardHelper.innerHTML += `${array[i]}&nbsp;&nbsp;`;

        if ((i + 1) % 8 === 0) {
            lineBreak = true;
        }
    }
    chessBoardHelper.innerHTML +="<br>";
    chessBoardHelper.innerHTML += "<br> E: Empty space";
    chessBoardHelper.innerHTML += "<br> Q: Queen piece";
    chessBoardHelper.innerHTML += "<br> R: Rook peice";
    chessBoardHelper.innerHTML += "<br> B: bishop peice";
    chessBoardHelper.innerHTML += "<br> K: knight peice";
};


const displayNextStep = (counter = 0) => {
    const steps = [generateD, selectionD, crossOverD, offspringD, mutationD];

    if (counter < steps.length) {
        document.body.appendChild(steps[counter]);
        steps[counter].style.left = '50%';

        setTimeout(() => {
            steps[counter].style.left = '-50%';
            displayNextStep(counter + 1);
        }, 2000);
    }
};

const transformFromArrayToChessBoard = (chromosomeArray) => {
    // Clear existing chess board
    const existingChessBoard = document.querySelector(".chess-board");
    if (existingChessBoard) {
        existingChessBoard.remove();
    }

    let chessBoard = document.createElement("div");
    chessBoard.classList.add("chess-board");

    for (let i = 0; i < chessHeight; i++) {
        const row = document.createElement("div");
        row.classList.add("chess-row");

        for (let j = 0; j < chessWidth; j++) {
            const index = i * chessWidth + j;
            const chessPiece = document.createElement("div");
            chessPiece.classList.add("chess-piece");

            const isWhiteSquare = (i + j) % 2 === 0;

            if (isWhiteSquare) {
                chessPiece.classList.add("white-square");
            } else {
                chessPiece.classList.add("black-square");
            }

            switch (chromosomeArray[index]) {
                case "Q":
                    chessPiece.innerHTML = queen;
                    break;
                case "K":
                    chessPiece.innerHTML = Knight;
                    break;
                case "R":
                    chessPiece.innerHTML = rook;
                    break;
                case "B":
                    chessPiece.innerHTML = bishop;
                    break;
            }

            row.appendChild(chessPiece);
        }

        chessBoard.appendChild(row);
    }

    document.body.appendChild(chessBoard);
    document.body.appendChild(chessBoardAnalyse);
};

const fillUpChromosome = () => {
    let array = [];

    let nrbQ = 0,
        nbrR = 0,
        nbrB = 0,
        nbrK = 0;
    for (let i = 0; i < chromosomeLength; i++) {
        let randomPiece = chessPeices[generateRandomPiece()];

        if (
            (randomPiece === "Q" && nrbQ < 2) ||
            (randomPiece === "R" && nbrR < 1) ||
            (randomPiece === "B" && nbrB < 1) ||
            (randomPiece === "K" && nbrK < 1)
        ) {
            array[i] = randomPiece;

            // Update counters for each piece type
            if (randomPiece === "Q") nrbQ++;
            else if (randomPiece === "R") nbrR++;
            else if (randomPiece === "B") nbrB++;
            else if (randomPiece === "K") nbrK++;
        } else {
            array[i] = "E";
        }
    }
    return array;
};

const calculateConflicts = (chromosome) => {
    let conflicts = 0;

    for (let i = 0; i < chromosome.length; i++) {
        const piece = chromosome[i];

        if (piece !== "E") {
            const row = Math.floor(i / chessWidth);
            const col = i % chessWidth;

            for (let j = i + 1; j < chromosome.length; j++) {
                const otherPiece = chromosome[j];

                if (otherPiece !== "E") {
                    const otherRow = Math.floor(j / chessWidth);
                    const otherCol = j % chessWidth;

                    // Check conflicts based on piece type
                    switch (piece) {
                        case "Q":
                            // Queens can move horizontally, vertically, and diagonally
                            if (
                                row === otherRow ||
                                col === otherCol ||
                                Math.abs(row - otherRow) === Math.abs(col - otherCol)
                            ) {
                                conflicts++;
                            }
                            break;
                        case "R":
                            // Rooks can move horizontally and vertically
                            if (row === otherRow || col === otherCol) {
                                conflicts++;
                            }
                            break;
                        case "B":
                            // Bishops can move diagonally
                            if (Math.abs(row - otherRow) === Math.abs(col - otherCol)) {
                                conflicts++;
                            }
                            break;
                        case "K":
                            // Knights move in an L-shaped pattern
                            if (
                                (Math.abs(row - otherRow) === 2 && Math.abs(col - otherCol) === 1) ||
                                (Math.abs(row - otherRow) === 1 && Math.abs(col - otherCol) === 2)
                            ) {
                                conflicts++;
                            }
                            break;
                    }
                }
            }
        }
    }

    return conflicts;
};


const createChromosome = () => {
    const array1 = fillUpChromosome();
    const array2 = fillUpChromosome();

    return array1.concat(array2);
};

const Selection = () => {
    generations.length = 0; // Clear existing generations

    // Normalize fitness values
    const totalFitness = chromosomes.reduce((sum, chromo) => sum + chromo.fitness, 0);
    const normalizedFitness = chromosomes.map(chromo => chromo.fitness / totalFitness);

    for (let i = 0; i < numberOfSelection; i++) {
        let parents = [];

        for (let j = 0; j < 2; j++) {
            const randomNum = Math.random();
            let cumulativeFitness = 0;

            for (let k = 0; k < chromosomes.length; k++) {
                cumulativeFitness += normalizedFitness[k];

                if (randomNum <= cumulativeFitness) {
                    parents.push(chromosomes[k]);
                    break;
                }
            }
        }

        generations.push(parents);
    }
};

const crossOver = () => {
    for (let i = 0; i < generations.length; i++) {
        const parents = generations[i];
        const crossoverPoint = Math.floor(chromosomeLength / 2);

        // Perform crossover by taking the first half of each parent
        const parent1 = parents[0].gens;
        const parent2 = parents[1].gens;

        const offspring1 = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
        const offspring2 = parent2.slice(0, crossoverPoint).concat(parent1.slice(crossoverPoint));

        // Replace old chromosomes with the new offspring in the chromosomes array
        chromosomes[i * 2] = {
            conflictNumber: calculateConflicts(offspring1),
            fitness: fitness(calculateConflicts(offspring1)),
            gens: offspring1,
        };

        chromosomes[i * 2 + 1] = {
            conflictNumber: calculateConflicts(offspring2),
            fitness: fitness(calculateConflicts(offspring2)),
            gens: offspring2,
        };
    }
};

const mutation = () => {
    for (let i = 0; i < chromosomes.length; i++) {
        const randomMutationProb = Math.random();

        if (randomMutationProb <= pMutation) {
            // Perform mutation
            const chromosome = chromosomes[i].gens;
            const randomMutationPoint = Math.floor(Math.random() * chromosome.length);

            // Generate a random piece for the mutation
            const randomPiece = chessPeices[generateRandomPiece()];

            // Mutate the chromosome at the random mutation point
            chromosome[randomMutationPoint] = randomPiece;

            // Update conflict and fitness values for the mutated chromosome
            const conflicts = calculateConflicts(chromosome);
            chromosomes[i] = {
                conflictNumber: conflicts,
                fitness: fitness(conflicts),
                gens: chromosome,
            };
        }
    }
};

const generateChromosomes = () => {
    chromosomes.length = 0; // Clear existing chromosomes
    for (let i = 0; i < numberOfChromosomes; i++) {
        const chromosome = createChromosome();
        const conflicts = calculateConflicts(chromosome);
        const fitnessValue = fitness(conflicts);

        chromosomes.push({
            conflictNumber: conflicts,
            fitness: fitnessValue,
            gens: chromosome,
        });
    }
    chromosomes.sort((a, b) => a.fitness - b.fitness);
    heighestConflict = chromosomes[0].conflictNumber; // get the heighest number ofchromsomes 
};

const originalChromosomes = [];

submitButton.addEventListener("click", () => {
    inputContainer.style.left = "-100%";
    numberOfChromosomes = parseInt(inputHolder.value);
    numberOfSelection = parseInt(inputHolder2.value);
    generateChromosomes();

    // Save a copy of the original chromosomes
    originalChromosomes.length = 0;
    originalChromosomes.push(...chromosomes.map(chromo => ({ ...chromo })));
    

    console.log("-------------------- Generation 0 ---------------")
    console.log(originalChromosomes);
    console.log("-------------------- After selection ---------------")
    Selection();
    console.log(generations);
    console.log("-------------------- After selection and crossover ---------------")
    crossOver();
    console.log(chromosomes);
    console.log("-------------------- After selection, crossover, and mutation ---------------")
    mutation();
    console.log(chromosomes);
    displayNextStep();

    const maxFitnessChromosome = chromosomes.reduce((max, current) => (current.fitness > max.fitness ? current : max), chromosomes[0]);
    leastConflict = maxFitnessChromosome.conflictNumber; // Get the least number of chromsomes 
    currentConflictHolder.textContent = `Current Conflict: ${leastConflict}`
    currentConflictDiffrence.textContent = `Number of conflicts reduced: ${heighestConflict - leastConflict}`
    tranfromChoosenChromosome(maxFitnessChromosome.gens); // Pass the array to be transdromed 
    // Display chessboard after 11 seconds
    setTimeout(() => {
        console.log("the chromosome with heighest fitness is :\n "+ maxFitnessChromosome.gens);
        transformFromArrayToChessBoard(maxFitnessChromosome.gens);
    }, 11000);
});
