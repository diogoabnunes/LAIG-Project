class Game extends CGFobject {
    constructor(scene) {
        super(scene);

        this.table = new Table(this.scene);
        this.pieces = new Pieces(this.scene);
        this.board = this.parseBoardJSProlog();
        this.server = new Server();
        this.buttons = new Buttons(this.scene);

        this.playerPurple = new Player(this.scene,"g", 6); // Player Purple: Goblins
        this.playerWhite = new Player(this.scene,"o", 14); // Player White: Orcs
        this.playerGreen = new Player(this.scene,"z", 10); // Player Green: Zombies
        this.greenSkull = new GreenSkull(this.scene,this.playerPurple); // Goblins start with the Greenskull

        this.state = {
            START: 0,
            PICKING_ORIGIN: 1,
            PICKING_DESTINY: 2,
            PLAY_AGAIN: 3,
            USE_GREEN_SKULL: 4,
            GAME_OVER: 5,
            SETTING_FINAL_SCORE: 6,
            QUIT: 7,
            MOVIE: 8
        };

        this.mode = {
            PLAYER_PLAYER: 0,
            PLAYER_BOT: 1,
            BOT_PLAYER:2,
            BOT_BOT: 3,
        };

        this.level = {
            EASY: 0,
            HARD: 1
        };
        
        this.selectedPiece;
        this.gameOver = false;
        this.playAgain=false;
        this.eated = false;
        this.moves = [];
        this.board = this.parseBoardJSProlog();
        this.possibleDestinies = [];
        this.counter = 0;

        this.onlyEatingDestinies = false;
        this.currentState = this.state.START;
        this.currentMode = this.mode.PLAYER_PLAYER;
        this.currentLevel = this.level.EASY;
        this.winner = [];
    }

    start() {
        this.quit();
        this.counter = 0;
        this.currMode = this.currentMode;
        this.currLevel = this.currentLevel;
       if(this.currMode==this.mode.BOT_BOT){
            this.playerPurple.setBotType();
            this.playerWhite.setBotType();
            this.playerGreen.setBotType();
       }else if(this.currMode==this.mode.PLAYER_BOT){
            this.playerPurple.setBotType();
            this.playerGreen.setBotType();
       }
       else if(this.currMode==this.mode.BOT_PLAYER){
            this.playerWhite.setBotType();
        }              
           
        this.greenSkull.player = this.playerPurple;
        this.currentPlayer = this.playerWhite; // Game always start white Orcs
        this.lastPlayer = this.playerWhite;
        this.currentState = this.state.PICKING_ORIGIN;
        this.parseBoardPrologJS(this.board);

        if (this.scene.fixCamera == false) this.changeCamera(this.playerGreen.position, this.playerWhite.position);
    }

    quit() {
        this.currentState = this.state.START;
        this.table = new Table(this.scene);
        this.pieces = new Pieces(this.scene);
        this.board = this.parseBoardJSProlog();

        this.playerPurple.score = 0;
        this.playerWhite.score = 0;
        this.playerGreen.score = 0;

        this.playerPurple.resetType();
        this.playerWhite.resetType();
        this.playerGreen.resetType();  

        this.scene.animations = [];
        this.moves = [];
        this.possibleDestinies = [];
        this.board = this.parseBoardJSProlog();
        this.parseBoardPrologJS(this.board);
    }

    getGamePlayer() {
        switch(this.currentPlayer.species) {
            case "g": return this.currentPlayer;
            case "o": return this.currentPlayer;
            case "z": return this.lastPlayer;
        }
    }

    setNextPlayer(){
        this.counter = 0;
        switch (this.currentPlayer.species) {
            case "g":
                this.lastPlayer = this.currentPlayer;
                this.currentPlayer = this.playerWhite;
                break;
            case "o":
                this.lastPlayer = this.currentPlayer;
                this.currentPlayer = this.playerPurple;
                break;
            case "z":
                if (this.lastPlayer == this.playerPurple) this.currentPlayer = this.playerWhite;
                else this.currentPlayer = this.playerPurple;
                this.lastPlayer = this.playerGreen;
        }
        if (this.scene.fixCamera == false) this.changeCamera(this.lastPlayer.position, this.currentPlayer.position);
    }
    setNextGreenskull(){
        if (this.eated == true) {
            switch (this.greenSkull.species) {
                case "g":
                    this.greenSkull.updatePlayer(this.playerWhite); 
                    this.playerGreen.changeType(this.playerWhite.type);           
                    break;
                case "o":
                    this.greenSkull.updatePlayer(this.playerPurple);
                    this.playerGreen.changeType(this.playerPurple.type);           
                    break;
            }
        }
        this.eated = false;
    }

    parseBoardJSProlog() {
        var board = "[";
        var column_length = 1;
        for (var row = 1; row <= 10; row++) {
            board += "[";
            for (var column = 1; column <= column_length; column++) {
                var type = "e";
                for (var i = 0; i < this.pieces.pieces.length; i++) {
                    if (this.pieces.pieces[i].x == row && this.pieces.pieces[i].y == column) {
                        type=this.pieces.pieces[i].type;
                        break;
                    }
                }
                board+=type;
                if (column != column_length) board += ",";
            }
            column_length++;
            board += "]";
            if (row != 10) board += ",";
        }
        board += "]";

        return board;
    }

    parseBoardPrologJS(board) {
        this.pieces.clear();
        board=board.slice(1,-1);
        var row = 1, column = 0;
        for (var i = 0; i < board.length; i++) {
            switch (board[i]) {
                case "[": column++; break;
                case ",": column++; break;
                case "]": row++; column = -1; break;
                
                case "g": this.pieces.pieces.push(new Goblin(this.scene, 0, parseInt(row.toString() + column.toString(), 'g'))); break;
                case "o": this.pieces.pieces.push(new Orc(this.scene,0,parseInt(row.toString() + column.toString(),"o"))); break;
                case "z": this.pieces.pieces.push(new Zombie(this.scene, 0, parseInt(row.toString() + column.toString(), "z"))); break;

                default: break;
            }
        }
    }

    pickingHandler(cell) {
        switch(this.currentState) {
            case this.state.PICKING_ORIGIN:
                if(this.currentPlayer.type=="bot" && cell == 12345){
                    console.log("picking origin");
                    this.choosePiece();
                }
                else if(this.currentPlayer.type=="player")
                    this.isValidPiece(cell, this.currentPlayer);
                break;

            case this.state.PICKING_DESTINY:
                if(this.currentPlayer.type=="bot" && cell == 12345){
                    console.log("picking destiny");
                    if (!this.playAgain) this.movePiece(this.selectedPiece.cell);
                    else this.BOTsecondMove(this.selectedPiece.cell);
                }
                else{
                    if (!this.playAgain) this.isValidMove(this.selectedPiece.cell, cell);
                    else this.secondMove(this.selectedPiece.cell,cell);
                }
                break;

            case this.state.USE_GREEN_SKULL:
                if(this.currentPlayer.type=="bot" && cell == 12345)
                    cell=Math.floor((Math.random() * 2) + 1);
                this.useGreenSkull(cell);
                break;
            
            case this.state.PLAY_AGAIN:
                if(this.currentPlayer.type=="bot" && cell == 12345)
                    cell=Math.floor((Math.random() * 2) + 1);
                this.canPlayAgain(cell);
                break;

            case this.state.GAME_OVER:
                break;

            case this.state.QUIT:
                break;
        
        }
    }

    getCurrentPlayerType() {
        if (this.currentPlayer == this.playerGreen) return this.playerGreen.type;
        else if (this.currentPlayer == this.playerPurple) return this.playerPurple.type;
        else if (this.currentPlayer == this.playerWhite) return this.playerWhite.type;
    }
    
    

    mappingCell(cell) {
        var row = 0, column = 0;
        var cellStr = cell.toString();
        switch(cellStr[0]) {
            case '1': 
                if (cellStr[1] == 0) {
                    row = parseInt(cellStr[0] + cellStr[1]);
                    column = parseInt(cellStr.substring(2));
                }
                else {
                    row = parseInt(cellStr[0]);
                    column = parseInt(cellStr[1]);
                }
                break;
            default:
                row = parseInt(cellStr[0]);
                column = parseInt(cellStr[1]);
                break;
        }
        return [row, column];
    }

    toList(response){
        var list = response.split("-");
        return list;
    }

    /* CHOOSE PIECE */
    choosePiece(){
        var game = this;
        var request="findPiece("+this.board+","+this.currentPlayer.species+")";
        this.server.makeRequest(request, function(data) {
            var response = game.toList(data.target.response);
            var cell = response[0]+response[1];
            game.isValidPiece(cell);
        }); 
    }

    isValidPiece(cell) {
        var [row, column] = this.mappingCell(cell);
        var game = this;
        this.possibleDestinies = [];
        var request="valid("+ this.board+","+this.currentPlayer.species+","+row + "," + column + ")";
        this.server.makeRequest(request, function(data) {
            if (data.target.response == "true") {
                for (var i = 0; i < game.pieces.pieces.length; i++) {
                    if(game.pieces.pieces[i].cell==cell) {
                        game.selectedPiece = game.pieces.pieces[i];
                        break;
                    }
                }
                game.findValidMoves(cell);
            }
            else {
                console.log("No piece on cell %d", cell);
            }
        });  
    }

    parseListofList(str){
        var listLists=[];
        if(str!="[]"){
            var str=str.slice(1,-1);
            var list=str.split(",");
            var list2=[0,0];
            for(var i=0; i < list.length;i++){
                if(list[i][0]=="[")
                    list2[0]=list[i].split("[");
                else{
                    list2[1]=list[i].split("]");
                    var l=list2[0]+list2[1];
                    l=l.slice(1,-1);
                    listLists.push(l);
                }
            }
        }
        return listLists;
    }
    parseListofListTOboardType(adjacentList,eatList ){
        var flag=false;
        for(var row=1; row<=10;row++){
            for(var column=1; column<=row;column++){
                var cell=row.toString()+column.toString();
                for(var j=0; j<adjacentList.length;j++){
                    if(cell==adjacentList[j] && this.onlyEatingDestinies == false){
                        this.possibleDestinies.push("X");
                        flag=true;
                    }
                }
                for(var j=0; j<eatList.length;j++){
                    if(cell==eatList[j]){
                        if(!flag)
                            this.possibleDestinies.push("X");
                        flag=true;
                    }
                }
                if(flag)
                    flag=false;
                else
                    this.possibleDestinies.push("0");     
            
                
            }
        }
    }
  
    findValidMoves(origin){
        var [row, column] = this.mappingCell(origin);
        var game = this;
        var request="validMoves("+this.board+","+row+","+column+")";
        this.server.makeRequest(request, function(data) {
            var response=game.toList(data.target.response);
            var adjacents=game.parseListofList(response[0]);
            var eats=game.parseListofList(response[1]);
            game.parseListofListTOboardType(adjacents,eats);
            if (game.isTherePossibleDestinies()) {
                console.log("Picking on cell %d", game.selectedPiece.cell);
                if (game.canPlayAgainVar == true) game.currentState = game.state.PLAY_AGAIN;
                else game.currentState = game.state.PICKING_DESTINY;
            }
            else {
                console.log("Picking on cell %d, but that piece has no allowed moves from there.", game.selectedPiece.cell);
            }
        });
    }

    isTherePossibleDestinies() {
        for (var i = 0; i < this.possibleDestinies.length; i++) {
            if (this.possibleDestinies[i] == "X") return true;
        }
        return false;
    }

    movePiece(origin){
        var game = this;
        var [rowPiece,columnPiece]=this.mappingCell(origin);
        var request="findMove("+this.board+","+rowPiece+"-"+columnPiece+")";
        this.server.makeRequest(request, function(data) {
            var response = game.toList(data.target.response);
            var cell = response[0]+response[1];
            game.isValidMove(origin,cell);
        }); 
    }

    isValidMove(origin,destiny){
        var [rowPiece, columnPiece] = this.mappingCell(origin);
        var [row, column] = this.mappingCell(destiny);
        var game = this;

        var request="movePiece("+this.board+"-["+this.playerWhite.getScore()+","+this.playerPurple.getScore()+","+this.playerGreen.getScore()+"]-"+this.currentPlayer.species+"-"+this.greenSkull.getPlayer().species+","+rowPiece+"-"+columnPiece+","+row+"-"+column+")";
        this.server.makeRequest(request, function(data) {
            var response= game.toList(data.target.response);

            if (response[0] == "true") {
                game.moves.push([origin, destiny, game.currentPlayer, game.board, 
                    game.playerWhite.getScore(), game.playerPurple.getScore(), game.playerGreen.getScore(), game.greenSkull.getPlayer(), "no", game.onlyEatingDestinies, game.lastPlayer]);

                game.board = response[1]; // NewBoard
                game.playerWhite.updateScore(response[2]); //PO1
                game.playerPurple.updateScore(response[3]); // PG1
                game.playerGreen.updateScore(response[4]); // PZ1
                
                if(response[7]=="e"){ //comeu peça
                    if (!game.eated) {
                        if (response[6] == "g") {
                            game.greenSkull.updatePlayer(game.playerPurple);
                            game.playerGreen.changeType(game.playerPurple.type);           
                        }
                        else if (response[6] == "o") {
                            game.greenSkull.updatePlayer(game.playerWhite);
                            game.playerGreen.changeType(game.playerWhite.type);           
                        }
                    }
                    game.eated = true;
                    game.selectedPiece.changeCell(destiny);
                    game.selectedPiece.moveAnimationPiece();
                    game.moveEatedPiece(origin,destiny,game.currentPlayer);
                    if(response[5]!="[]"){
                        console.log("Play again possible!");
                        game.canPlayAgainVar = true;
                        game.selectedPiece.cell=destiny;
                        game.possibleDestinies = [];
                        game.onlyEatingDestinies = true;
                        game.findValidMoves(destiny);
                    }
                    else{
                        //console.log("Play again impossible.");
                        game.endTurn();
                    }
                        
                }
                else{
                    game.selectedPiece.changeCell(destiny);
                    game.selectedPiece.moveAnimationPiece();
                    game.endTurn(response[6]);
                } 
            }
            else if (origin == destiny) { // release piece picked
                console.log("Unpicking on cell %d", origin);
                game.currentState = game.state.PICKING_ORIGIN;
            }
            else { // release piece picked
                if(game.getCurrentPlayerType()=="bot")
                    game.currentState=game.state.PICKING_ORIGIN;
                console.log("Move not valid.");
            }
        });  
    }

    BOTsecondMove(origin) {
        var game = this;
        var [rowPiece,columnPiece]=this.mappingCell(origin);
        var request="findMove("+this.board+","+rowPiece+"-"+columnPiece+")";
        this.server.makeRequest(request, function(data) {
            var response = game.toList(data.target.response);
            var cell = response[0]+response[1];
            game.isValidMove(origin,cell);
        }); 
    }

    //move segunda vez
    secondMove(origin,destiny){
        var [rowPiece, columnPiece] = this.mappingCell(origin);
        var [row, column] = this.mappingCell(destiny);
        if (row == rowPiece && column == columnPiece) {
            console.log("Unpicking on cell %d", origin);
            return;
        }
        var indexDestiny = this.findIndexFromCell(destiny);
        if (this.possibleDestinies[indexDestiny] != "X") {
            console.log("Can't move to that cell (%d)")
            return;
        }

        var game = this;

        var request="inListEat("+row+"-"+column+","+rowPiece+"-"+columnPiece+"-"+this.board+")";
        this.server.makeRequest(request, function(data) {
            var response= game.toList(data.target.response);
            if(response=="true"){
                game.isValidMove(origin,destiny);
            }
            else{
                game.currentState=game.state.PICKING_DESTINY;
            }
        });
    }

    useGreenSkull(id) {
        if (id == 1) {
            this.lastPlayer = this.currentPlayer;
            this.currentPlayer = this.playerGreen;
            this.counter = 0;
            if (this.scene.fixCamera == false) this.changeCamera(this.lastPlayer.position, this.currentPlayer.position);
            this.currentState = this.state.PICKING_ORIGIN;
            console.log("Yes I do!");
        }
        else if (id == 2) {
            this.setNextPlayer();
            this.currentState = this.state.PICKING_ORIGIN;
            console.log("No I don't!");
        }
    }

    canPlayAgain(id) {
        if (id == 1) {
            this.currentState = this.state.PICKING_DESTINY;
            this.playAgain = true;
            console.log("Yes I do!");
        }
        else if (id == 2) {
            this.canPlayAgainVar = false;
            this.playAgain = false;
            this.onlyEatingDestinies = false;

            //doesnt ask if wanna play with greenSkull tho
            /*if (this.currentPlayer.species == this.greenSkull.getPlayer().species) {
                this.currentState = this.state.USE_GREEN_SKULL;
                console.log("Releasing on cell %d", this.selectedPiece.cell);
                console.log("2You have the GreenSkull! Do you want to use it?");
            }*/
            
            this.setNextGreenskull();
            this.setNextPlayer();
            this.currentState = this.state.PICKING_ORIGIN;
            console.log("No I don't!");
        }
    }

    undo() {
        if (this.moves.length == 0) {
            console.log("Can't undo: no moves.");
            return;
        }
        else if (this.currentState != this.state.PICKING_ORIGIN) {
            console.log("Cant undo on that state.")
        }
        var lastMove = this.moves[this.moves.length - 1];
        this.moves.pop();

        if (lastMove[8] == "yes") {
            var piece = lastMove[0];
            piece.oldXCell = lastMove[3];
            piece.oldYCell = lastMove[4];
            piece.xCell = lastMove[1];
            piece.yCell = lastMove[2];
            this.undoRemovePiece(piece, lastMove[5]);
            piece.moveAnimationEatedPiece();

            lastMove = this.moves[this.moves.length - 1];
            this.moves.pop();
        }  

        for (var i = 0; i < this.pieces.pieces.length; i++) {
            if(this.pieces.pieces[i].cell==lastMove[1]) {
                this.selectedPiece = this.pieces.pieces[i];
                break;
            }
        }
        
        this.board = lastMove[3];
        this.currentPlayer = lastMove[2];
        this.playerWhite.score = lastMove[4];
        this.playerPurple.score = lastMove[5];
        this.playerGreen.score = lastMove[6];
        this.greenSkull.player = lastMove[7];
        this.onlyEatingDestinies = lastMove[9];
        this.selectedPiece.changeCell(parseInt(lastMove[0]));
        this.selectedPiece.moveAnimationPiece();

        if (this.scene.fixCamera == false) this.changeCamera(lastMove[10].position, lastMove[2].position);
        console.log("Undoing last move.");     
    }

    getEatedPiece(origin,destiny){
        var [rowOrigin, columnOrigin] = this.mappingCell(origin);
        var [rowDestiny, columnDestiny] = this.mappingCell(destiny);
        var row= Math.ceil((rowDestiny-rowOrigin)/2)+ rowOrigin;
        var column=Math.ceil((columnDestiny-columnOrigin)/2)+columnOrigin;
        for(var i=0; i<this.pieces.pieces.length;i++){
           var [r,c]=this.mappingCell(this.pieces.pieces[i].cell);
            if(r==row && c==column){
                return this.pieces.pieces[i];
            }
        }
    }

    moveEatedPiece(origin,destiny,player){
        var eatedPiece= this.getEatedPiece(origin,destiny);
        console.log("Piece on cell %d eated.", eatedPiece.cell);
        for (var i = 0; i < this.pieces.pieces.length; i++) {
            if (eatedPiece.cell == this.pieces.pieces[i].cell) {
                this.removePiece(eatedPiece, player.species);
            }
        }
        eatedPiece.moveAnimationEatedPiece();
    }

    removePiece(piece, playerSpecies) {
        for (var i = 0; i < this.pieces.pieces.length; i++) {
            if (this.pieces.pieces[i] == piece) {
                this.pieces.pieces.splice(i, 1);
                break;
            }
        }
        piece.oldXCell = piece.xCell;
        piece.oldYCell = piece.yCell;

        switch (playerSpecies) {
            case "g": 
                piece.xCell = 0.8*(this.pieces.gPiecesEated.length % 10);
                piece.yCell = -9 + 0.8*Math.floor(this.pieces.gPiecesEated.length/10);
                this.pieces.gPiecesEated.push(piece);
                break;

            case "o":
                piece.xCell = 0.8*(this.pieces.oPiecesEated.length % 10);
                piece.yCell = 9 - 0.8*Math.floor(this.pieces.oPiecesEated.length/10);
                this.pieces.oPiecesEated.push(piece);
                break;

            case "z":
                piece.xCell = 8.4;
                piece.yCell = -5 + 0.8*this.pieces.zPiecesEated.length;
                this.pieces.zPiecesEated.push(piece);
                break;
        }

        this.moves.push([piece, piece.oldXCell, piece.oldYCell, piece.xCell, piece.yCell, playerSpecies, 0, 0, "yes", this.onlyEatingDestinies]);
    }

    undoRemovePiece(piece, playerSpecies) {
        switch(playerSpecies) {
            case "g":
                for (var i = 0; i < this.pieces.gPiecesEated.length; i++) {
                    if (this.pieces.gPiecesEated[i] == piece) {
                        this.pieces.gPiecesEated.splice(i, 1);
                        break;
                    }
                }
                this.pieces.pieces.push(piece);
                break;

            case "o":
                for (var i = 0; i < this.pieces.oPiecesEated.length; i++) {
                    if (this.pieces.oPiecesEated[i] == piece) {
                        this.pieces.oPiecesEated.splice(i, 1);
                        break;
                    }
                }
                this.pieces.pieces.push(piece);
                break;

            case "z":
                for (var i = 0; i < this.pieces.zPiecesEated.length; i++) {
                    if (this.pieces.zPiecesEated[i] == piece) {
                        this.pieces.zPiecesEated.splice(i, 1);
                        break;
                    }
                }
                this.pieces.pieces.push(piece);
                break;
        }
    }

    endTurn(){
        this.eated = false;
        this.isGameOver();
        this.onlyEatingDestinies = false;
        this.playAgain = false;
        this.canPlayAgainVar = false;

        if (this.currentState != this.state.GAME_OVER){        
            if (this.currentPlayer.species == this.greenSkull.getPlayer().species) {
                this.currentState = this.state.USE_GREEN_SKULL;
                console.log("Releasing on cell %d", this.selectedPiece.cell);
                console.log("Do you want to use Green Skull?");
            }
            else if (this.currentPlayer.species == "z") {
                this.setNextPlayer();
                this.currentState = this.state.PICKING_ORIGIN;
                console.log("Releasing on cell %d", this.selectedPiece.cell);
            }
            else {
                this.setNextPlayer();
                this.currentState = this.state.PICKING_ORIGIN;
                console.log("Releasing on cell %d", this.selectedPiece.cell);
            }
        }
    }

    /* GAME OVER FUNCTIONS */
    isGameOver(){
        var game=this;
        var request="isOver("+this.board+")";
        this.server.makeRequest(request, function(data) {
            if (data.target.response == "true") {
                game.currentState = game.state.GAME_OVER;
                console.log("Game Over!");
            }
        });
    }

    getFinalScores(){
        var game = this;
        var request="finalScores("+this.board+"-["+this.playerWhite.getScore()+","+this.playerPurple.getScore()+","+this.playerGreen.getScore()+"])";
        this.server.makeRequest(request, function(data) {
            var response=game.toList(data.target.response);
            game.playerWhite.updateScore(response[0]);
            game.playerPurple.updateScore(response[1]);
            game.playerGreen.updateScore(response[2]);
            game.getWinner();
        }); 
    }

    getWinner(){
        var game=this;
        var request="getWinner("+this.playerWhite.getScore()+"-"+this.playerPurple.getScore()+"-"+this.playerGreen.getScore()+")";
        this.server.makeRequest(request, function(data) {
            game.gettingRealWinner(data.target.response);
        }); 
    }

    gettingRealWinner(response) {
        var winners = this.toList(response);
        if (winners.length == 1) {
            if (winners[0] == "t") {
                this.winner.push("o");
                this.winner.push("g");
                this.winner.push("z");
            }
            else this.winner.push(response[0]);
        }
        else {
            this.winner = winners;
        }
        if (this.scene.fixCamera == false) this.changeCamera(this.currentPlayer.position, this.playerGreen.position);
        this.currentState = this.state.QUIT;
    }
    
    gameOverFunc(){
        this.currentState = this.state.SETTING_FINAL_SCORE;
        this.getFinalScores();
    }

    findIndexFromCell(cell) {
        switch(cell.toString()) {
            case "11": return 0;
            case "21": return 1;
            case "22": return 2;
            case "31": return 3;
            case "32": return 4;
            case "33": return 5;
            case "41": return 6;
            case "42": return 7;
            case "43": return 8;
            case "44": return 9;
            case "51": return 10;
            case "52": return 11;
            case "53": return 12;
            case "54": return 13;
            case "55": return 14;
            case "61": return 15;
            case "62": return 16;
            case "63": return 17;
            case "64": return 18;
            case "65": return 19;
            case "66": return 20;
            case "71": return 21;
            case "72": return 22;
            case "73": return 23;
            case "74": return 24;
            case "75": return 25;
            case "76": return 26;
            case "77": return 27;
            case "81": return 28;
            case "82": return 29;
            case "83": return 30;
            case "84": return 31;
            case "85": return 32;
            case "86": return 33;
            case "87": return 34;
            case "88": return 35;
            case "91": return 36;
            case "92": return 37;
            case "93": return 38;
            case "94": return 39;
            case "95": return 40;
            case "96": return 41;
            case "97": return 42;
            case "98": return 43;
            case "99": return 44;
            case "101":return 45;
            case "102":return 46;
            case "103":return 47;
            case "104":return 48;
            case "105":return 49;
            case "106":return 50;
            case "107":return 51;
            case "108":return 52;
            case "109":return 53;
            case "1010": return 54;
        }
    }

    changeCamera(lastPos, newPos) {
        console.log(lastPos, newPos);
        var c = new CameraAnimation("id", this.scene, lastPos, newPos);
        this.scene.animations.push(c);
    }

    movie() {
        console.log("Movie!");
        var moves = this.moves;
        moves.push([0,0,0,0,0,0,0,0,"no"]);
        this.quit();
        this.currentState = this.state.MOVIE;
        var t = this.scene.getTime();
        var first = this.scene.getTime();

        for (var i = 0; i < moves.length - 1; i++) {
            // move
            for (var j = 0; j < this.pieces.pieces.length; j++) {
                if(this.pieces.pieces[j].cell==moves[i][0]) {
                    this.selectedPiece = this.pieces.pieces[j];
                    break;
                }
            }
            this.selectedPiece.changeCell(moves[i][1]);
            this.selectedPiece.moveAnimationPieceMovie(first, t);

            if (moves[i+1][8] == "yes") {
                console.log(moves[i+1]);
                // peça comida
                for (var j = 0; j < this.pieces.pieces.length; j++) {
                    var oldCell = moves[i+1][1].toString() + moves[i+1][2].toString();
                    if(this.pieces.pieces[j].cell==oldCell) {
                        this.selectedPiece = moves[i+1];
                        this.selectedPiece.oldXCell = moves[i+1][1];
                        this.selectedPiece.oldXCell = moves[i+1][2];
                        this.selectedPiece.xCell = moves[i+1][3];
                        this.selectedPiece.yCell = moves[i+1][4];
                        this.selectedPiece.moveAnimationEatedPieceMovie(first, t);
                        break;
                    }
                }
                i++;
            }
            t += 3;
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(10, 3.02, 10);
        this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
        this.scene.scale(0.4, 0.4, 0.4);

        if (this.currLevel == this.level.EASY && this.currentState == this.state.PICKING_DESTINY) {
            this.table.displayPossibleDestinies(this.possibleDestinies);
        }
        else {
            this.table.display();
        }
        this.pieces.display();
        this.greenSkull.display();

        this.scene.translate(0, 6.4, 0);

        if (this.currentState == this.state.PICKING_ORIGIN || this.currentState == this.state.PICKING_DESTINY) {
            var t = Math.floor(this.scene.getTime());
            if (this.counter == 0) this.counter = t;
            this.s = t - this.counter;
            this.desc = Math.abs(15 - this.s);
            if (this.s < 15) {
                this.buttons.counterDisplay(this.desc);
            }
            else {
                this.setNextPlayer();
                console.log("Time is up! You lost your turn.");
            }
        }
        if (this.getCurrentPlayerType()=="bot" && this.currentState != this.state.START) this.buttons.botButtonDisplay();

        switch(this.currentState) {
            case this.state.START: this.buttons.toStart(); break;
            case this.state.PICKING_ORIGIN: this.buttons.playerTurn(this.currentPlayer); break;
            case this.state.PICKING_DESTINY: this.buttons.playerTurn(this.currentPlayer); break;
            case this.state.USE_GREEN_SKULL: this.buttons.playerHasGreenSkullDisplay(); break;
            case this.state.PLAY_AGAIN: this.buttons.wantPlayAgainDisplay(); break;
            case this.state.GAME_OVER: this.gameOverFunc(); break;
            case this.state.SETTING_FINAL_SCORE: break;
            case this.state.QUIT: this.buttons.displayWinner(this.winner); break;
        }

        if (this.currentState != this.state.START || this.currentState == this.state.MOVIE) {
            this.buttons.gScore(this.playerPurple.getScore());
            this.buttons.oScore(this.playerWhite.getScore());
            this.buttons.zScore(this.playerGreen.getScore());
        }

        this.scene.popMatrix();
    }
}