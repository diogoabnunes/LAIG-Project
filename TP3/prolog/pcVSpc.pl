:-use_module(library(random)).
:-use_module(library(system)).



%------------ P C  VS  P C -----------------------------
% Starts the PC vs PC level
pc_pc:-
    initial(GameState-Player-GreenSkull),nl,
    write('               Choose Orcs level:     '),nl,nl,
    get_level(LevelO),
    write('               Choose Goblins level:     '),nl,nl,
    get_level(LevelG),
    play_game(GameState-[0,0,0],Player,GreenSkull,LevelO-LevelG).


% Plays one round of the game, players plays, see if can repeat, sees if can play as zombie and plays
play_game(GameState-[PO,PG,PZ],Player,GreenSkull,LevelO-LevelG):-
    display_game(GameState-GreenSkull,Player),
    choose_level_round(Player,GreenSkull,LevelO-LevelG,Level),
    choose_move(GameState, Player,Level,RowPiece-ColumnPiece-Row-Column),
    move(GameState-[PO,PG,PZ]-Player-GreenSkull, RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull),
    nl, write('Player: '), write(Player), nl,
    write('Start position - End position: ['), write(RowPiece-ColumnPiece-Row-Column), write(']'), nl,
    play_again_bot(NewGameState-[PO1,PG1,PZ1], ListEat, Player-[Row, Column]-MoveType, NewerGameState-[PO2,PG2,PZ2]),
    play_zombies_bot(Level, NewerGameState-[PO2,PG2,PZ2]-Player-NewGreenSkull, _-_-RowZombie-ColumnZombie-MoveTypeZombie, NewZombieGameState-[PO3,PG3,PZ3]-ListEatZombie-NewerGreenSkull),
    play_again_zombies(NewZombieGameState-[PO3,PG3,PZ3]-NewerGreenSkull, ListEatZombie, Player-[RowZombie, ColumnZombie]-MoveTypeZombie, FinalGameState-[POF,PGF,PZF]-NewestGreenSkull),
    sleep(5),
    next(Player,FinalGameState-[POF,PGF,PZF], NewestGreenSkull,LevelO,LevelG).


% Checks if can start the next round
%   - Sees if the game is over
%   - Displays current scores
%   - Sets the player for the next round
%   - Starts next round
% [PO1,PG1,PZ1] - Score list
next(Player,GameState-[PO1,PG1,PZ1],GreenSkull,LevelO,LevelG):-
    \+ game_over(GameState-[PO1,PG1,PZ1], _),!,
    display_scores(PO1-PG1-PZ1),
    set_next_player(Player, NextPlayer),
    play_game(GameState-[PO1,PG1,PZ1], NextPlayer, GreenSkull,LevelO-LevelG).
next(_,_-_,_,_,_).


% Gets the difficulty level - Sadly only the first one (random) is implemented
choose_level_round(o,_,LO-_,Level):-Level=LO.
choose_level_round(g,_,_-LG,Level):-Level=LG.
choose_level_round(z,o,LO-_,Level):-Level=LO.
choose_level_round(z,g,_-LG,Level):-Level=LG.


% Checks if the user wants to play as a zombie, if so the chosen position input is validated and the zombie moves
play_zombies_bot(Level, GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull) :-
    GreenSkull == Player,
    ResponseList = [y, n],
    random_member(Response, ResponseList),
    choose_move(GameState, Player,Level,RowPiece-ColumnPiece-Row-Column),
    zombie_move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull, Response),
    display_board(NewGameState),
    nl, write('Zombie of player: '), write(Player), nl,
    write('Start position - End position: ['), write(RowPiece-ColumnPiece-Row-Column), write(']'), nl,
    sleep(5).

play_zombies_bot(_, GameState-[PO,PG,PZ]-_-GreenSkull, _, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull) :-
    NewGameState = GameState,
    [PO1,PG1,PZ1] = [PO,PG,PZ],
    NewGreenSkull = GreenSkull,
    ListEat = [].



% ----------------------------------- Playing Again ----------------------------------

% ----------------------------- Player Bot ------------------------------
    
% Checks if Player can play again based on:
%   - ListEat (list of moves the player can make after eating one piece) not being empty
%   - MoveType having been e (eating)
play_again_bot(GameState-[PO,PG,PZ], [], _, FinalGameState-[POF,PGF,PZF]) :-
    FinalGameState = GameState,
    [POF,PGF,PZF] = [PO,PG,PZ].

play_again_bot(GameState-[PO,PG,PZ], ListEat, Player-[Row, Column]-e, FinalGameState-[POF,PGF,PZF]) :-
    ResponseList = [y, n],
    random_member(Response, ResponseList),
    checks_play_again_bot(GameState-[PO,PG,PZ], ListEat, Player-[Row, Column]-e, FinalGameState-[POF,PGF,PZF], Response).

play_again_bot(GameState-[PO,PG,PZ], _, _, FinalGameState-[POF,PGF,PZF]) :-
    FinalGameState = GameState,
    [POF,PGF,PZF] = [PO,PG,PZ].


% Gets generates player input, validates it, changes the board and the score and sees if there are more plays possible
checks_play_again_bot(GameState-[PO,PG,PZ], ListEat, Player-[Row, Column]-e, FinalGameState-[POF,PGF,PZF], y) :-
    random_member([RowInput, ColumnInput], ListEat),
    !, 
    change_board(GameState, Row-Column, RowInput-ColumnInput, NewGameState, ElemEaten),
    change_score([PO,PG,PZ]-Player-ElemEaten,[PO1,PG1,PZ1]),
    nl, display_board(NewGameState),
    nl, write('Player: '), write(Player), nl,
    write('Start position - End position: ['), write(Row-Column-RowInput-ColumnInput), write(']'), nl,
    sleep(5),
    get_move_eat(RowInput, ColumnInput, NewListEat, NewGameState),
    play_again_bot(NewGameState-[PO1,PG1,PZ1], NewListEat, Player-[RowInput, ColumnInput]-e, FinalGameState-[POF,PGF,PZF]).

checks_play_again_bot(GameState-[PO,PG,PZ], _, _, FinalGameState-[POF,PGF,PZF], n) :-
    FinalGameState = GameState,
    [POF,PGF,PZF] = [PO,PG,PZ].



% -------------------------- Auxiliar functions --------------------------
% Generates pc play
choose_move(GameState,Player,1, RowPiece-ColumnPiece-Row-Column):-
    find_piece(GameState,Player,RowPiece-ColumnPiece),
    find_move(GameState,RowPiece-ColumnPiece,Row-Column),
    sleep(5).


% Generates valid starting piece
find_piece(GameState,Player,RowPiece-ColumnPiece):-
    % Generates list with available pieces
    valid_pieces(GameState,Player,List),
    length(List,N),
    % Randomly chooses one
    get_random(N,R),
    nth1(R,List,[RowPiece,ColumnPiece]),
    valid_piece(GameState,Player,RowPiece,ColumnPiece),!.

% Return a list with all coordenates of Player pieces currently playing
valid_pieces(GameState,Player,List):-
    find_pieces(GameState,Player,1,[],List).

% valid_pieces auxiliary function to go through full board
find_pieces(GameState,Player,NRow,List,FinalList):-
    nth1(NRow,GameState,Row), 
    member(Player,Row),
    getCoordinates(Row,NRow-1,Player,[],List2),
    NewNRow is NRow+1,
    find_pieces(GameState,Player,NewNRow,List,AlmostList),
    append(List2,AlmostList,FinalList).
find_pieces(_,_,11,_,[]).
find_pieces(GameState,Player,NRow,List,FinalList):- 
    NewNRow is NRow+1,
    find_pieces(GameState,Player,NewNRow,List,FinalList).

% find_pieces auxiliary function to go through full row
getCoordinates(Row,NRow-NColumn,Player,List,FinalList):-
    NColumn=<NRow,
    nth1(NColumn,Row,Elem),
    Elem==Player,!,
    append(List,[[NRow,NColumn]],NewList),
    NewNColumn is NColumn+1,
    getCoordinates(Row,NRow-NewNColumn,Player,[],AlmostList),
    append(NewList,AlmostList,FinalList).
getCoordinates(_,NRow-NColumn,_,_,[]):-
    NextNRow is NRow+1,
    NColumn==NextNRow.
getCoordinates(Row,NRow-NColumn,Player,List,FinalList):-
    NewNColumn is NColumn+1,
    getCoordinates(Row,NRow-NewNColumn,Player,List,FinalList).


% Generates move
find_move(GameState,RowPiece-ColumnPiece,Row-Column):-
    valid_moves(GameState, _-RowPiece-ColumnPiece, ListAdjacentMoves-ListEatMoves),
    random(1,2,RList),
    choose_list(ListAdjacentMoves-ListEatMoves,RList,List),
    random_member(Move, List),
    [Row, Column] = Move.

% find_move auxiliary function
choose_list(ListAdjacentMoves-_,1,ListAdjacentMoves).
choose_list(_-ListEatMoves,2,ListEatMoves).
choose_list([]-ListEatMoves,1,ListEatMoves).
choose_list(ListAdjacentMoves-[],2,ListAdjacentMoves).

    