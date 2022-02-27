:-include('utils.pl').
:-include('scores.pl').



% -------------------- Choosing and validating a piece to play ---------------------------
% Chooses piece to move and sees if it's valid
choose_piece(GameState,Player,Row,Column):-
    repeat,
    input_play('Which piece:',Row,Column),
    valid_piece(GameState,Player,Row,Column,_),!.


% Sees if the piece chosen is valid
valid_piece(GameState,o,Row,Column,true) :- 
    nth1(Row,GameState,L),
    nth1(Column,L,Elem),
    Elem==o.

valid_piece(GameState,g,Row,Column,true) :- 
    nth1(Row,GameState,L),
    nth1(Column,L,Elem),
    Elem==g.

valid_piece(GameState,z,Row,Column,true):-
    nth1(Row,GameState,L),
    nth1(Column,L,Elem),
    Elem==z.

valid_piece(_, _, _, _, false).

%original valid piece
valid_piece(GameState,o,Row,Column) :- 
    nth1(Row,GameState,L),
    nth1(Column,L,Elem),
    Elem==o.

valid_piece(GameState,g,Row,Column) :- 
    nth1(Row,GameState,L),
    nth1(Column,L,Elem),
    Elem==g.

valid_piece(GameState,z,Row,Column):-
    nth1(Row,GameState,L),
    nth1(Column,L,Elem),
    Elem==z.



% ------------------------------- Moving a piece -------------------------------------------
% Choose where you want to move the piece and sees if is valid----------------------------
% GameState - game state before any action
% [PO,PG,PZ] - game score
% GreenSkull - who currently has the green skull
% Player - whoose turn it is to play this round
% -----------------------------------------------
% RowPiece - row index of the piece you want to move
% ColumnPiece - column index of the piece you want to move
% -----------------------------------------------
% FinalGameState - game state after an sequence of actions
% [POF,PGF,PZF] - game score after an sequence of actions
% FinalGreenSkull - who currently has the green skull after an sequence of actions

% Does a full round of movements
move_human_piece(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece,FinalGameState-[POF,PGF,PZF]-FinalGreenSkull):-
    repeat,
    input_play('Where to:',Row,Column),
    move(GameState-[PO,PG,PZ]-Player-GreenSkull, RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull),
    play_again(NewGameState-[PO1,PG1,PZ1], ListEat, Player-[Row, Column]-MoveType, NewerGameState-[PO2,PG2,PZ2]),
    play_zombies(NewerGameState-[PO2,PG2,PZ2]-Player-NewGreenSkull, _-_-RowZombie-ColumnZombie-MoveTypeZombie, NewZombieGameState-[PO3,PG3,PZ3]-ListEatZombie-NewerGreenSkull),
    play_again_zombies(NewZombieGameState-[PO3,PG3,PZ3]-NewerGreenSkull, ListEatZombie, Player-[RowZombie, ColumnZombie]-MoveTypeZombie, FinalGameState-[POF,PGF,PZF]-NewestGreenSkull),
    change_green_skull(MoveTypeZombie, Player, NewestGreenSkull, FinalGreenSkull).


% Checks if a certain player position input is a valid play to make, if so the player makes it
move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull,true):- 
    valid_moves(GameState, Player-RowPiece-ColumnPiece, LAM-LEM),
    is_valid_move(GameState, LAM-LEM, [Row, Column], MoveType),
    change_green_skull(MoveType, Player, GreenSkull, NewGreenSkull),
    change_board(GameState, RowPiece-ColumnPiece, Row-Column, NewGameState, ElemEaten),
    change_score([PO,PG,PZ]-Player-ElemEaten,[PO1,PG1,PZ1]),
    get_move_eat(Row, Column, ListEat, NewGameState).

move(_-_-_-_,_-_-_-_-_, _-_-_-_,false).


% Checks if a certain zombie position input is a valid play to make, if so the player plays it
% After it, displays a simpler board, the score and checks if there are more possible plays
zombie_move(GameState-[PO,PG,PZ]-Player-GreenSkull, RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull, y) :-
    valid_moves(GameState, z-RowPiece-ColumnPiece, LAM-LEM),
    is_valid_move(GameState, LAM-LEM, [Row, Column], MoveType),
    change_board(GameState, RowPiece-ColumnPiece, Row-Column, NewGameState, ElemEaten),
    change_score([PO,PG,PZ]-Player-ElemEaten,[PO1,PG1,PZ1]),
    get_move_eat(Row, Column, ListEat, NewGameState),
    NewGreenSkull = GreenSkull.

zombie_move(GameState-[PO,PG,PZ]-_-GreenSkull, _, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull, n) :-
    NewGameState = GameState,
    [PO1,PG1,PZ1] = [PO,PG,PZ],
    NewGreenSkull = GreenSkull,
    ListEat = [].


% Asks if the user wants to play as a zombie, if so the chosen position input is validated and the zombie moves
play_zombies(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull) :-
    GreenSkull == Player,
    input_message('Play with a zombie? [y/n]', Response),
    display_board(GameState),
    choose_piece(GameState,z,RowPiece,ColumnPiece),
    input_play('Where to:',Row,Column),
    zombie_move(GameState-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece-Row-Column-MoveType, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull, Response).

play_zombies(GameState-[PO,PG,PZ]-_-GreenSkull, _, NewGameState-[PO1,PG1,PZ1]-ListEat-NewGreenSkull) :-
    NewGameState = GameState,
    [PO1,PG1,PZ1] = [PO,PG,PZ],
    NewGreenSkull = GreenSkull,
    ListEat = [].



% ----------------------------------- Playing Again ----------------------------------

% ----------------------------- Player ------------------------------
    
% Checks if Player can play again based on:
%   - ListEat (list of moves the player can make after eating one piece) not being empty
%   - MoveType having been e (eating)
play_again(GameState-[PO,PG,PZ], [], _, FinalGameState-[POF,PGF,PZF]) :-
    FinalGameState = GameState,
    [POF,PGF,PZF] = [PO,PG,PZ].

play_again(GameState-[PO,PG,PZ], ListEat, Player-[Row, Column]-e, FinalGameState-[POF,PGF,PZF]) :-
    input_message('Play again? [y/n]', Response),
    checks_play_again(GameState-[PO,PG,PZ], ListEat, Player-[Row, Column]-e, FinalGameState-[POF,PGF,PZF], Response).

play_again(GameState-[PO,PG,PZ], _, _, FinalGameState-[POF,PGF,PZF]) :-
    FinalGameState = GameState,
    [POF,PGF,PZF] = [PO,PG,PZ].


% Gets player input, validates it, changes the board and the score and sees if there are more plays possible
checks_play_again(GameState-[PO,PG,PZ], ListEat, Player-[Row, Column]-e, FinalGameState-[POF,PGF,PZF], y) :-
    display_board(GameState),
    input_play('Where to go:',RowInput,ColumnInput),
    is_member([RowInput, ColumnInput], ListEat),
    !, 
    write('Valid!'), nl,
    change_board(GameState, Row-Column, RowInput-ColumnInput, NewGameState, ElemEaten),
    change_score([PO,PG,PZ]-Player-ElemEaten,[PO1,PG1,PZ1]),
    get_move_eat(RowInput, ColumnInput, NewListEat, NewGameState),
    play_again(NewGameState-[PO1,PG1,PZ1], NewListEat, Player-[RowInput, ColumnInput]-e, FinalGameState-[POF,PGF,PZF]).

checks_play_again(GameState-[PO,PG,PZ], _, _, FinalGameState-[POF,PGF,PZF], n) :-
    FinalGameState = GameState,
    [POF,PGF,PZF] = [PO,PG,PZ].


% ----------------------------- Zombie ------------------------------
% Checks if Zombie can play again based on:
%   - ListEat (list of moves the zombie can make after eating one piece) not being empty
%   - MoveType having been e (eating)
play_again_zombies(GameState-[PO,PG,PZ]-GreenSkull, [], _, FinalGameState-[POF,PGF,PZF]-NewGreenSkull) :-
    FinalGameState = GameState,
    [POF,PGF,PZF] = [PO,PG,PZ],
    NewGreenSkull = GreenSkull.

play_again_zombies(GameState-[PO,PG,PZ]-GreenSkull, ListEat, Player-[Row, Column]-e, FinalGameState-[POF,PGF,PZF]-NewGreenSkull) :-
    write('Green skull: '), write(GreenSkull), nl, 
    GreenSkull == Player,
    input_message('Play again with zombie? [y/n]', Response),
    checks_play_again(GameState-[PO,PG,PZ], ListEat, Player-[Row, Column]-e, FinalGameState-[POF,PGF,PZF], Response),
    change_green_skull(e, Player, GreenSkull, NewGreenSkull).

play_again_zombies(GameState-[PO,PG,PZ]-GreenSkull, _, _, FinalGameState-[POF,PGF,PZF]-NewGreenSkull) :-
    FinalGameState = GameState,
    [POF,PGF,PZF] = [PO,PG,PZ],
    NewGreenSkull = GreenSkull.



% ---------------------------------- Validators ---------------------------------------
% For a piece [Row/Column], gets 2 lists with its valid moves
valid_moves(GameState, _-Row-Column, ListAdjacentMoves-ListEatMoves) :-
    get_adjacent_move(Row, Column, ListAdjacentMoves, GameState),
    get_move_eat(Row, Column, ListEatMoves, GameState).

% Checks if a certain position is a member of the list of valid moves
% LAM - List of Adjacent Moves
% LEM - List of Eating Moves
is_valid_move(_, LAM-_, Position, a) :-
    is_member(Position, LAM).
% Only this one changes ElemEaten
is_valid_move(_, _-LEM, Position, e) :-
    is_member(Position, LEM).



% --------------------------------------- Change Board -----------------------------------------------
% Changes the board by simulating the movement of a piece
% The piece starts at position [RowPiece, ColumnPiece] and goes to [Row, Column]
% The final board is placed in variable NewGameState

% Changes board when there is adjacent movement
change_board(GameState, RowPiece-ColumnPiece, Row-Column, NewGameState, e) :-
    R is abs(RowPiece-Row),
    C is abs(ColumnPiece-Column),
    R=<1,
    C=<1,
    change_board_aux(RowPiece,ColumnPiece, Row, Column, GameState,NewGameState).

% Changes board when there are eaten pieces
change_board(GameState, RowPiece-ColumnPiece, Row-Column, NewGameState, ElemEaten) :-
    RowTest is (Row-RowPiece)/2, is_int(RowTest), R is ceiling(RowTest),
    ColumnTest is (Column-ColumnPiece)/2, is_int(ColumnTest), C is round(ColumnTest), 
    RowFood is RowPiece + R, 
    ColumnFood is ColumnPiece + C,
    change_board_aux(RowPiece, ColumnPiece, Row, Column, RowFood, ColumnFood, GameState, NewGameState, ElemEaten).


% Works for movement in the same row
change_board_aux(RowPiece, ColumnPiece, Row, Column, GameState, NewGameState) :-
    % Value of place piece is jumping from - start
    nth1(RowPiece,GameState,ResultRowStart),
    nth1(ColumnPiece,ResultRowStart,ElemStart),
    % Value of place piece is jumping to - end
    nth1(Row,GameState,ResultRowEnd),
    nth1(Column, ResultRowEnd,ElemEnd),
    % Switching places
    % Putting end element in starting place
    ResultRowStart == ResultRowEnd, !,
    replace(ResultRowStart, ColumnPiece, ElemEnd, IntermidiateRow),
    replace(GameState, RowPiece, IntermidiateRow, IntermidiateGameState),
    % Putting start element in end place
    replace(IntermidiateRow, Column, ElemStart, FinalRow),
    replace(IntermidiateGameState, Row, FinalRow, NewGameState).

% Works for movement across different rows
change_board_aux(RowPiece,ColumnPiece, Row, Column, GameState,NewGameState) :-
    % Value of place piece is jumping from - start
    nth1(RowPiece,GameState,ResultRowStart),
    nth1(ColumnPiece,ResultRowStart,ElemStart),
    % Value of place piece is jumping to - end
    nth1(Row,GameState,ResultRowEnd),
    nth1(Column, ResultRowEnd,ElemEnd),
    % Switching places
    % Putting end element in starting place
    replace(ResultRowStart, ColumnPiece, ElemEnd, FinalRowStart),
    replace(GameState, RowPiece, FinalRowStart, IntermidiateGameState),
    % Putting start element in end place
    replace(ResultRowEnd, Column, ElemStart, FinalRowEnd),
    replace(IntermidiateGameState, Row, FinalRowEnd, NewGameState).

% Movemement in the same row, for plays that involve eating other pieces
change_board_aux(RowPiece, ColumnPiece, Row, Column, RowFood, ColumnFood, GameState, NewGameState, ElemFood) :-
    % Value of place piece is jumping from - start
    nth1(RowPiece,GameState,ResultRowStart),
    nth1(ColumnPiece,ResultRowStart,ElemStart),
    % Value of food piece 
    nth1(RowFood,GameState,ResultRowFood),
    nth1(ColumnFood, ResultRowFood,ElemFood),
    % Value of place piece is jumping to - end
    nth1(Row,GameState,ResultRowEnd),
    nth1(Column, ResultRowEnd,ElemEnd),
    % Switching places
    % Putting end element in starting place
    ResultRowStart == ResultRowEnd, !,
    replace(ResultRowStart, ColumnPiece, ElemEnd, IntermidiateRow),
    replace(GameState, RowPiece, IntermidiateRow, IntermidiateGameState),
    % Replacing food element with empty space
    replace(IntermidiateRow, ColumnFood, e, FoodRow),
    replace(IntermidiateGameState, RowFood, FoodRow, FoodGameState),
    % Putting end element in end place
    replace(FoodRow, Column, ElemStart, FinalRow),
    replace(FoodGameState, Row, FinalRow, NewGameState).

% Movemement accross different rows, for plays that involve eating other pieces
change_board_aux(RowPiece, ColumnPiece, Row, Column, RowFood, ColumnFood, GameState, NewGameState, ElemFood) :-
    % Value of place piece is jumping from - start
    nth1(RowPiece,GameState,ResultRowStart),
    nth1(ColumnPiece,ResultRowStart,ElemStart),
    % Value of food piece 
    nth1(RowFood,GameState,ResultRowFood),
    nth1(ColumnFood, ResultRowFood,ElemFood),
    % Value of place piece is jumping to - end
    nth1(Row,GameState,ResultRowEnd),
    nth1(Column, ResultRowEnd,ElemEnd),
    % Switching places
    % Putting end element in starting place
    replace(ResultRowStart, ColumnPiece, ElemEnd, FinalRowStart),
    replace(GameState, RowPiece, FinalRowStart, IntermidiateGameState),
    % Putting space in food element
    replace(ResultRowFood, ColumnFood, e, FinalRowFood),
    replace(IntermidiateGameState, RowFood, FinalRowFood, FoodGameState),
    % Putting end element in end place
    replace(ResultRowEnd, Column, ElemStart, FinalRowEnd),
    replace(FoodGameState, Row, FinalRowEnd, NewGameState).



% --------------------------- Adjacent Plays List --------------------------------------------
% Gets a list of adjacent places a player can jump to 
% RowPiece - row of piece playing
% ColumnPiece - column of piece playing
% L6 - list of all plays a player can make, if empty the next player takes the turn
% GameState - Current game state
get_adjacent_move(RowPiece, ColumnPiece, L6, GameState) :-
    get_adjacent_move_left(RowPiece, ColumnPiece, [], L1, GameState),
    get_adjacent_move_right(RowPiece, ColumnPiece, L1, L2, GameState),
    get_adjacent_move_upper_right(RowPiece, ColumnPiece, L2, L3, GameState),
    get_adjacent_move_lower_left(RowPiece, ColumnPiece, L3, L4, GameState),
    get_adjacent_move_upper_left(RowPiece, ColumnPiece, L4, L5, GameState),
    get_adjacent_move_lower_right(RowPiece, ColumnPiece, L5, L6, GameState).


% Choose move eat
% Horizontal
get_adjacent_move_left(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd = RowPiece,
    ColumnEnd is ColumnPiece - 1,
    get_individual_move_2(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_adjacent_move_left(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

get_adjacent_move_right(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd = RowPiece,
    ColumnEnd is ColumnPiece + 1,
    get_individual_move_2(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_adjacent_move_right(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

% Same column
get_adjacent_move_upper_right(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd is RowPiece - 1,
    ColumnEnd = ColumnPiece,
    get_individual_move_2(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_adjacent_move_upper_right(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

get_adjacent_move_lower_left(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd is RowPiece + 1,
    ColumnEnd = ColumnPiece,
    get_individual_move_2(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_adjacent_move_lower_left(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

% Other 2 hypothesis
get_adjacent_move_upper_left(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd is RowPiece - 1,
    ColumnEnd is ColumnPiece - 1,
    get_individual_move_2(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_adjacent_move_upper_left(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

get_adjacent_move_lower_right(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd is RowPiece + 1,
    ColumnEnd is ColumnPiece + 1,
    get_individual_move_2(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_adjacent_move_lower_right(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.


% Builds the list of adjacent moves a player can make
get_individual_move_2(_, _, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState):-
    RowEnd > 0,
    RowEnd =< 10,
    ColumnEnd > 0,
    ColumnEnd =< RowEnd,
    % Checks end cell to see if it's empty
    nth1(RowEnd, GameState, RowEndResult),
    nth1(ColumnEnd, RowEndResult, ElemEnd),
    ElemEnd == e,
    % Appends it to the list of plays - PlaysList
    append(PlaysList, [[RowEnd, ColumnEnd]], NewPlaysList).



% --------------------------- Eating Plays List --------------------------------------------
% Gets a list of places a player can jump to after jumping once
% RowPiece - row of piece playing
% ColumnPiece - column of piece playing
% L6 - list of all plays a player can make, if empty the next player takes the turn
% GameState - Current game state
get_move_eat(RowPiece, ColumnPiece, L6, GameState) :-
    get_move_left(RowPiece, ColumnPiece, [], L1, GameState),
    get_move_right(RowPiece, ColumnPiece, L1, L2, GameState),
    get_move_upper_right(RowPiece, ColumnPiece, L2, L3, GameState),
    get_move_lower_left(RowPiece, ColumnPiece, L3, L4, GameState),
    get_move_upper_left(RowPiece, ColumnPiece, L4, L5, GameState),
    get_move_lower_right(RowPiece, ColumnPiece, L5, L6, GameState), !.


% Choose move eat
% Horizontal
get_move_left(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd = RowPiece,
    ColumnEnd is ColumnPiece - 2,
    get_individual_move(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_move_left(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

get_move_right(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd = RowPiece,
    ColumnEnd is ColumnPiece + 2,
    get_individual_move(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_move_right(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

% Same column
get_move_upper_right(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd is RowPiece - 2,
    ColumnEnd = ColumnPiece,
    get_individual_move(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_move_upper_right(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

get_move_lower_left(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd is RowPiece + 2,
    ColumnEnd = ColumnPiece,
    get_individual_move(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_move_lower_left(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

% Other 2 hypothesis
get_move_upper_left(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd is RowPiece - 2,
    ColumnEnd is ColumnPiece - 2,
    get_individual_move(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_move_upper_left(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.

get_move_lower_right(RowPiece, ColumnPiece, PlaysList, NewPlaysList, GameState) :-
    RowEnd is RowPiece + 2,
    ColumnEnd is ColumnPiece + 2,
    get_individual_move(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState).
get_move_lower_right(_, _, PlaysList, NewPlaysList, _) :- NewPlaysList = PlaysList.
    

% Builds list of moves a player can make when he want to eat a piece
get_individual_move(RowPiece, ColumnPiece, RowEnd, ColumnEnd, PlaysList, NewPlaysList, GameState):-
    RowEnd > 0,
    RowEnd =< 10,
    ColumnEnd > 0,
    ColumnEnd =< RowEnd,
    % Checks end cell to see if it's empty
    nth1(RowEnd, GameState, RowEndResult),
    nth1(ColumnEnd, RowEndResult, ElemEnd),
    ElemEnd == e,
    % Calculates the position of food element
    RowTest is (RowEnd-RowPiece)/2, is_int(RowTest), R is ceiling(RowTest),
    ColumnTest is (ColumnEnd-ColumnPiece)/2, is_int(ColumnTest), C is round(ColumnTest), 
    RowFood is RowPiece + R, ColumnFood is ColumnPiece + C,
    % Gets food element
    nth1(RowFood, GameState, RowFoodResult),
    nth1(ColumnFood, RowFoodResult, Elem),
    Elem \== e,
    % Appends it to the list of plays - PlaysList
    append(PlaysList, [[RowEnd, ColumnEnd]], NewPlaysList).

get_individual_move(_, _, _, _, PlaysList, NewerPlaysList, _) :- 
    NewerPlaysList = PlaysList.
