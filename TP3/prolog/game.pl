:-include('display.pl').
:-include('moves.pl').
:-include('humanVShuman.pl').
:-include('pcVSpc.pl').
:-include('humanVSpc.pl').
:-include('pcVShuman.pl').

% Starts GreenSkull
play:-
    display_menu(C),
    option(C).



% ------------------------- Menu options -------------------------------
option(1):-
    display_instructions,
    play.

option(2):-
    display_play(C),
    play_game(C).



% -------------------------- Start game options -------------------------
play_game(1):-
    display_play_mode(1),
    human_human.

play_game(2):-
    display_play_mode(2),
    human_pc.

play_game(3):-
    display_play_mode(3),
    pc_human.

play_game(4):-
    display_play_mode(4),
    pc_pc.



% Initializes the game
% GameState - Current state of the board
% Player - Who's currently playing
% GreenSkull - Who's currently holding the GreenSkull
initial(GameState-Player-GreenSkull) :-
    final_board(GameState),
    initial_player(Player),
    initial_green_skull(GreenSkull).



% ---------------------------------- Game Over ---------------------------------------------
% Checks if game is over, if so displays the end layout with the final scores and the winner
% [PO,PG,PZ] - Score list
% Winner - Player that has the biggest score
game_over(GameState-[PO,PG,PZ],Winner):-
    is_over(GameState),!,
    display_board(GameState),
    display_game_over,
    final_scores(GameState-[PO,PG,PZ],[PO1,PG1,PZ1]),
    display_final_scores(PO1-PG1-PZ1),
    get_winner(PO1-PG1-PZ1,Winner),
    display_winner(Winner).


% Game can end if:
%   - One species was wiped out (no more pieces currently playing)
% or:
%   - All pieces of a species are touching the corresponding line (the line opposite from where they started)

% Checks 1st condition (if one species is no longer playing)
is_over(GameState,true) :- 
    write('here!!'),
    pieces_out(GameState).

% Checks 2nd condition (if all pieces of a species are touching the corresponding line)
is_over(GameState,true):-
    color_in_line(GameState).

is_over(_,false).


% Verifies 1st condition (if one species is no longer playing)
% Checks zombies
pieces_out(GameState) :- 
    allElemetsOut(GameState,z,1).
% Checks Orcs
pieces_out(GameState) :- 
    allElemetsOut(GameState,o,1).
% Checks Goblins
pieces_out(GameState) :- 
    allElemetsOut(GameState,g,1).


% Goes through all rows of the board GameState to find elements of type Player
% Returns true if it doesn't find any
% N - index of the row being searched
allElemetsOut(_,_,11).
allElemetsOut(GameState,Player,N):-
    N=<10,
    nth1(N,GameState,L),
    \+ member(Player,L),
    N1 is N+1,
    allElemetsOut(GameState,Player,N1).


% Verifies 2nd condition (if all pieces of a species are touching the corresponding line)
% Checks if all zombies are in the row number 10
color_in_line(GameState) :-
    zombies_spread(GameState,1).
% Checks if all orcs are in the column number 1
color_in_line(GameState) :- 
    orcs_spread(GameState,10).
% Checks if all goblins are in the last column of every row
color_in_line(GameState) :- 
    goblins_spread(GameState,2).


% Goes through all rows except the last one, looking for zombies
% If it finds zombies returns false, zombies do not satisfy the 2nd condition of game over
zombies_spread(GameState,Indice):-
    Indice<10,
    nth1(Indice,GameState,L),
    \+ member(z,L),
    NewIndice is Indice+1,
    zombies_spread(GameState,NewIndice).
zombies_spread(_,10).

% Goes through all columns (left diagonals) except the first one, looking for orcs
% If it finds orcs returns false, orcs do not satisfy the 2nd condition of game over
orcs_spread(GameState,Indice):-
    Indice>1,
    get_left_diagonal(GameState,Indice,Indice,L),
    \+ member(o,L),
    NewIndice is Indice-1,
    orcs_spread(GameState,NewIndice).
orcs_spread(_,1).

% Goes through all right diagonals (row number = column number) except the last one, looking for goblins
% If it finds goblins returns false, goblins do not satisfy the 2nd condition of game over
goblins_spread(GameState,Indice):-
    Indice<10,
    get_right_diagonal(GameState,Indice,Indice,L),
    \+ member(g,L),
    NewIndice is Indice+1,
    goblins_spread(GameState,NewIndice).
goblins_spread(_,10).


% All winner possibilities
% PO1 - Orcs' score
% PG1 - Goblins' score
% PZ1 - Zombies' score

% Winner is Orcs
get_winner(PO1-PG1-PZ1,Player):-
    PO1>PG1,
    PO1>PZ1,
    Player=o.
% Winner is Goblins
get_winner(PO1-PG1-PZ1,Player):-
    PG1>PO1,
    PG1>PZ1,
    Player=g.
% Winner is Zombies
get_winner(PO1-PG1-PZ1,Player):-
    PZ1>PG1,
    PZ1>PO1,
    Player=z.
% No winners - t for tie
get_winner(PO1-PG1-PZ1,Player):-
    PO1==PG1,
    PZ1==PO1,
    Player=t.
% Winners are Orcs and Globins
get_winner(PO1-PG1-PZ1,Player):-
    PO1==PG1,
    PO1>PZ1,
    Player=o-g.
% Winners are Orcs and Zombies
get_winner(PO1-PG1-PZ1,Player):-
    PO1==PZ1,
    PO1>PG1,
    Player=o-z.
% Winners are Zombies and Globins
get_winner(PO1-PG1-PZ1,Player):-
    PZ1==PG1,
    PZ1>PO1,
    Player=g-z.




% --------------------- Game Utils --------------------------

% Defines the next player according to who played before
% set_next_player(Player, NextPlayer)
set_next_player(o, g).
set_next_player(g, o).

% The orcs start playing first
initial_player(o).
	
% The globins start with the Green Skull
initial_green_skull(g).

% Changes who has the Green Skull
% green_skull(GreenSkull, NewGreenSkull)
green_skull(o, g).
green_skull(g, o).

% Changes who has the Green Skull based on the type of move (e - eating, a - adjacent) 
% and on who was already with the Green Skull (if it was the Player or not)
change_green_skull(e, Player, GreenSkull, NewGreenSkull) :-
    Player == GreenSkull,
    green_skull(GreenSkull, NewGreenSkull).
change_green_skull(e, _, GreenSkull, NewGreenSkull) :-
    NewGreenSkull = GreenSkull.
change_green_skull(a, _, GreenSkull, NewGreenSkull) :-
    NewGreenSkull = GreenSkull.

% Choose pc's game level 
get_level(Level):-
    display_level,
    read(Level),nl,nl.    

% Calculates Player's value
value(GameState, o, Value):-
    find_pieces(GameState,o,1,[],OList),
    find_pieces(GameState,g,1,[],GList),
    find_pieces(GameState,z,1,[],ZList),
    length(OList,O),
    length(GList,G),
    length(ZList,Z),
    Value is O/(G+Z).

value(GameState, g, Value):-
    find_pieces(GameState,o,1,[],OList),
    find_pieces(GameState,g,1,[],GList),
    find_pieces(GameState,z,1,[],ZList),
    length(OList,O),
    length(GList,G),
    length(ZList,Z),
    Value is G/(O+Z).

value(GameState, z, Value):-
    find_pieces(GameState,o,1,[],OList),
    find_pieces(GameState,g,1,[],GList),
    find_pieces(GameState,z,1,[],ZList),
    length(OList,O),
    length(GList,G),
    length(ZList,Z),
    Value is Z/(G+O).