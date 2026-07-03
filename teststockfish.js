const { spawn } = require("child_process");

const engine = spawn(
    "./stockfish/stockfish-windows-x86-64-avx2.exe"
);


async function analyzePosition(fen) {
    return await new Promise((resolve) => {

        let evaluation = null;

        const handleData = (data) => {
            const lines = data.toString().split("\n");

            for (const line of lines) {

                const scoreMatch = line.match(/score cp (-?\d+)/);
                const mateMatch = line.match(/score mate (-?\d+)/);

                if (scoreMatch) {
                    evaluation ={
                        type: "cp",
                        value: Number (scoreMatch[1])
                    }
                }
                else if(mateMatch){
                    evaluation = {
                        type: "mate",
                        value: Number(mateMatch[1])
                    }
                }

                if (line.startsWith("bestmove")) {

                    const bestMove =
                        line.split(" ")[1];

                    engine.stdout.off(
                        "data",
                        handleData
                    );

                    resolve({
                        evaluation,
                        bestMove
                    });
                }
            }
        };

        engine.stdout.on(
            "data",
            handleData
        );

        engine.stdin.write(
            `position fen ${fen}\n`
        );

        engine.stdin.write(
            "go depth 10\n"
        );
    });
}

module.exports = {
    analyzePosition
};