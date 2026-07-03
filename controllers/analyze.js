const { Chess } = require('chess.js');
const { analyzePosition } = require('../teststockfish.js')

async function analyze(req, res) {
    const pgn = req.body.gamePgn;
    const game = new Chess();
    game.loadPgn(pgn);
    const headers = game.getHeaders();
    console.log(headers);
    const moves = game.history();
    const replay = new Chess();
    const positions = [];

    for (const move of moves) {

        let result = await analyzePosition(replay.fen());
        if (replay.turn() === 'b') {
            result.evaluation.value = -result.evaluation.value;
        }
        positions.push({
            move,
            fenBefore: replay.fen(),
            result: result.evaluation,
            bestMove: result.bestMove,
        });
        replay.move(move);
    }

    let result = await analyzePosition(replay.fen());
        if (replay.turn() === 'b') {
            result.evaluation.value = -result.evaluation.value;
        }
        positions.push({
            fenBefore: replay.fen(),
            result: result.evaluation,
        });
        

    // Evaluation comments & storing fenAfter in positions

    for(let i=0;i<positions.length-1;i++){
        positions[i].fenAfter = positions[i+1].fenBefore;
        let curr = positions[i];
        let next = positions[i+1];
        if(curr.result.type === 'mate' || next.result.type === 'mate'){
            positions[i].comment = "Mate Sequence";
            continue;
        }

        const loss = Math.abs(curr.result.value-next.result.value);
        if(loss<=10) positions[i].comment = "Best";
        else if(loss<=25) positions[i].comment = "Excellent";
        else if(loss<=50) positions[i].comment = "Good";
        else if(loss<=80) positions[i].comment = "Inaccuracy";
        else if(loss<=100) positions[i].comment = "Mistake";
        else positions[i].comment = "Blunder";

    }

    positions.pop();
    res.render('results', {
        positions,
        headers,
    });
}

module.exports = {
    analyze,
};


