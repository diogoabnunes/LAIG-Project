%------------ H U M A N   VS   H U M A N -----------------------------
% Starts the game
human_human:- 
    initial(GameState-Player-GreenSkull),
    play_round(GameState-[0,0,0], Player, GreenSkull).

   
% Plays one round of game:
%   - Displays the full board
%   - Player chooses the piece they want to move
%   - Piece moves
%   - Sees if it can go to next round
% [PO,PG,PZ] - Score list
play_round(GameState-[PO,PG,PZ], Player, GreenSkull):- 
    display_game(GameState-GreenSkull,Player),
    choose_piece(GameState,Player,RowPiece,ColumnPiece),
    move_human_piece(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece,NewGameState-[PO1,PG1,PZ1]-NewGreenSkull),
    next(Player,NewGameState-[PO1,PG1,PZ1],NewGreenSkull).
    

% Checks if can start the next round
%   - Sees if the game is over
%   - Displays current scores
%   - Sets the player for the next round
%   - Starts next round
% [PO1,PG1,PZ1] - Score list
next(Player,GameState-[PO1,PG1,PZ1],GreenSkull):-
    \+ game_over(GameState-[PO1,PG1,PZ1], _),!,
    display_scores(PO1-PG1-PZ1),
    set_next_player(Player, NextPlayer),
    play_round(GameState-[PO1,PG1,PZ1], NextPlayer, GreenSkull).
next(_,_-_,_).
