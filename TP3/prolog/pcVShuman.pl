% Starts game
pc_human:-
    initial(GameState-Player-GreenSkull),
    write('               Choose Orcs level:     '),nl,
    get_level(LevelO),
    play_pc_human_game(GameState-[0,0,0],Player,GreenSkull,LevelO).


% Human plays as the goblins
% Displays the game, chooses the piece to play with, plays, checks if can play again, checks if can play as zombies, plays as zombie
% Generates the next round
play_pc_human_game(GameState-[PO,PG,PZ],g,GreenSkull,LevelO):-
    display_game(GameState-GreenSkull,g),
    choose_piece(GameState,g,RowPiece,ColumnPiece),
    move_human_piece(GameState-[PO,PG,PZ]-g-GreenSkull, RowPiece-ColumnPiece, NewGameState-[PO1,PG1,PZ1]-FinalGreenSkull),
    nextPH(o,NewGameState-[PO1,PG1,PZ1],FinalGreenSkull,LevelO).
    

% PC plays as the orcs
% Displays the game, chooses the piece to play with, plays, checks if can play again, checks if can play as zombies, plays as zombie
% Generates the next round
play_pc_human_game(GameState-[PO,PG,PZ],o,GreenSkull,LevelO):-
    display_game(GameState-GreenSkull,o),
    choose_move(GameState, o,LevelO, RowPiece-ColumnPiece-Row-Column),
    move(GameState-[PO,PG,PZ]-o-GreenSkull, RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull),   
    nl, write('Player: '), write(o), nl,
    write('Start position - End position: ['), write(RowPiece-ColumnPiece-Row-Column), write(']'), nl,

    play_again_bot(NewGameState-[PO1,PG1,PZ1], ListEat, o-[Row, Column]-MoveType, NewerGameState-[PO2,PG2,PZ2]),
    play_zombies_bot(LevelO, NewerGameState-[PO2,PG2,PZ2]-o-NewGreenSkull, _-_-RowZombie-ColumnZombie-MoveTypeZombie, NewZombieGameState-[PO3,PG3,PZ3]-ListEatZombie-NewerGreenSkull),
    play_again_zombies(NewZombieGameState-[PO3,PG3,PZ3]-NewerGreenSkull, ListEatZombie, o-[RowZombie, ColumnZombie]-MoveTypeZombie, FinalGameState-[POF,PGF,PZF]-NewestGreenSkull),
    sleep(5),
    nextPH(g,FinalGameState-[POF,PGF,PZF],NewestGreenSkull,LevelO).


% Generates next round
nextPH(Player,GameState-[PO1,PG1,PZ1],GreenSkull,Level):-
    \+ game_over(GameState-[PO1,PG1,PZ1], _),!,
    display_scores(PO1-PG1-PZ1),
    set_next_player(Player, NextPlayer),
    write(NextPlayer),
    play_pc_human_game(GameState-[PO1,PG1,PZ1], NextPlayer, GreenSkull,Level).
nextPH(_,_-_,_,_).

