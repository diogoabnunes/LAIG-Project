% Starts game
human_pc:-
    initial(GameState-Player-GreenSkull),
    write('               Choose Goblins level:     '),nl,
    get_level(LevelG),
    play_human_pc_game(GameState-[0,0,0],Player,GreenSkull,LevelG).



% Human plays as the orcs
% Displays the game, chooses the piece to play with, plays, checks if can play again, checks if can play as zombies, plays as zombie
% Generates the next round
play_human_pc_game(GameState-[PO,PG,PZ],o,GreenSkull,LevelG):-
    display_game(GameState-GreenSkull,o),
    choose_piece(GameState,o,RowPiece,ColumnPiece),
    move_human_piece(GameState-[PO,PG,PZ]-o-GreenSkull, RowPiece-ColumnPiece, NewGameState-[PO1,PG1,PZ1]-FinalGreenSkull),
    nextHP(o,NewGameState-[PO1,PG1,PZ1],FinalGreenSkull,LevelG).
    

% PC plays as the goblins
% Displays the game, chooses the piece to play with, plays, checks if can play again, checks if can play as zombies, plays as zombie
% Generates the next round
play_human_pc_game(GameState-[PO,PG,PZ],g,GreenSkull,LevelG):-
    display_game(GameState-GreenSkull,g),
    choose_move(GameState, g,LevelG, RowPiece-ColumnPiece-Row-Column),
    move(GameState-[PO,PG,PZ]-g-GreenSkull, RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull),   
    nl, write('Player: '), write(g), nl,
    write('Start position - End position: ['), write(RowPiece-ColumnPiece-Row-Column), write(']'), nl,

    play_again_bot(NewGameState-[PO1,PG1,PZ1], ListEat, g-[Row, Column]-MoveType, NewerGameState-[PO2,PG2,PZ2]),
    play_zombies_bot(LevelG, NewerGameState-[PO2,PG2,PZ2]-g-NewGreenSkull, _-_-RowZombie-ColumnZombie-MoveTypeZombie, NewZombieGameState-[PO3,PG3,PZ3]-ListEatZombie-NewerGreenSkull),
    play_again_zombies(NewZombieGameState-[PO3,PG3,PZ3]-NewerGreenSkull, ListEatZombie, g-[RowZombie, ColumnZombie]-MoveTypeZombie, FinalGameState-[POF,PGF,PZF]-NewestGreenSkull),
    sleep(5),
    nextHP(g,FinalGameState-[POF,PGF,PZF],NewestGreenSkull,LevelG).


% Generates next round
nextHP(Player,GameState-[PO1,PG1,PZ1],GreenSkull,Level):-
    \+ game_over(GameState-[PO1,PG1,PZ1], _),!,
    display_scores(PO1-PG1-PZ1),
    set_next_player(Player, NextPlayer),
    write(NextPlayer),
    play_human_pc_game(GameState-[PO1,PG1,PZ1], NextPlayer, GreenSkull,Level).
nextHP(_,_-_,_,_).
