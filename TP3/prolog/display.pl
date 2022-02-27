:-include('data.pl').



% ---------------------------- Display Game -------------------------------
% Display current state of the game
% GameState - current state of the board
% Player - who plays this turn
% GreenSkull - who has the Green Skull
display_game(GameState-GreenSkull, Player) :-
    display_board(GameState),
    display_green_skull(GreenSkull), 
    display_player_turn(Player),
    value(GameState,Player,Value),
    display_value(Player,Value),
    nl, nl.



% ---------------------------- Display Board -----------------------------
% Displays current board
display_board(GameState) :-
    nl,nl,print_board(GameState,0),
    hex_code(10,C),write(C),nl,nl,
    write('                         z o m b i e s'),nl,
    display_column_numbers,
    nl, nl.


% Auxiliar function that helps display_board printing the full board
print_board([],_).
print_board([H|T],N) :- 
    hex_code(N,C),write(C),nl,
    space(N,S),write(S),
    write('|'), print_row(H), write('     | '),
    N1 is N+1,
    nl,
    print_board(T,N1).


% Auxiliar function that prints a single row
print_row([]).
print_row([H|T]):-
    code(H,P),   
    write(P),
    write('|'),
    print_row(T).


% Auxiliar function that prints column numbers
display_column_numbers:-
    write('        - - - - - - - - - - - - - - - - - - - - - - - -   '), nl, nl,
    write('       1   2   3   4   5   6   7   8   9   10'),
    nl.



% ---------------------------- Displays Round Data -------------------------
% Display who plays this round
display_player_turn(o):- 
    nl, write('                     TURN TO PLAY, ORCS!').
display_player_turn(g):-  
    nl, write('                    TURN TO PLAY, GOBLINS!').
display_player_turn(z):-
    nl, write('                    TURN TO PLAY, ZOMBIES!').

% Display who has the Green Skull
display_green_skull(o) :-
    nl, write('                  ORCS HAVE THE GREEN SKULL!').
display_green_skull(g) :-
    nl, write('                 GOBLINS HAVE THE GREEN SKULL!').



% ---------------------------- Displays Menus --------------------------------    
% Displays main Green Skull menu
display_menu(C):-
    write('                  |   G R E E N  S K U L L  |'),nl,
    write('               ---------------------------------'),nl,
    write('                  |     1. Instructions     |'),nl,
    write('                  |     2. Play             |'),nl,
    write('               ---------------------------------'),nl,
    write('                  |                         |'),nl,
    write('               Option: '),read(C),nl,nl.

% Displays instructions menu
display_instructions:-
    write('                  | I N S T R U C T I O N S |'),nl,
    write('               ---------------------------------'),nl,
    write('                  | Try to get your pieces  |'),nl,
    write('                  | across the field while  |'),nl,
    write('                  | eating as many enimies  |'),nl,
    write('                  | as you can!             |'),nl,
    write('                  |                         |'),nl,
    write('                  | Whoever holds the Green |'),nl,
    write('                  | Skull, is in charge of  |'),nl,
    write('                  | the Zombienation!       |'),nl,
    write('               ---------------------------------'),nl,
    write('                  |                         |'),nl,nl,nl.

% Displays game mode
display_play(C):-
    write('                  |         P L A Y         |'),nl,
    write('               ---------------------------------'),nl,
    write('                  |     1. Human VS Human   |'),nl,
    write('                  |     2. Human Starts     |'),nl,
    write('                  |     3. Pc Starts        |'),nl,
    write('                  |     4. Pc VS Pc         |'),nl,
    write('               ---------------------------------'),nl,
    write('                  |                         |'),nl,nl,
    write('                Option: '),read(C),nl,nl.

% Displays game header
display_play_mode(1):-
    write('                   H U M A N   VS   H U M A N   '),nl,
    write('               ---------------------------------'),nl,nl.

display_play_mode(2):-
    write('                      H U M A N   VS   P C      '),nl,
    write('               ---------------------------------'),nl,nl.

display_play_mode(3):-
    write('                      P C   VS   H U M A N      '),nl,
    write('               ---------------------------------'),nl,nl.

display_play_mode(4):-
    write('                         P C   VS   P C         '),nl,
    write('               ---------------------------------'),nl,nl.

% Displays difficulty levels (only easy is implemented)       
display_level:-
    write('                  |         L E V E L       |'),nl,
    write('               ---------------------------------'),nl,
    write('                  |         1. Easy         |'),nl,
    write('                  |         2. Hard         |'),nl,
    write('               ---------------------------------'),nl,
    write('                  |                         |'),nl,
    write('               Option: ').



% -------------------------------- Scores Menu ---------------------------------
% O - Orcs' score
% G - Goblins' score
% Z - Zombies' score

% Displays score information
display_scores(O-G-Z):-
    nl,nl,
    write('                          S C O R E S       '),nl,
    write('               ---------------------------------'),nl,
    write('                        ORCS: '), write(O),nl,
    write('                        GOBLINS: '), write(G),nl,
    write('                        ZOMBIES: '), write(Z),nl,
    write('               ---------------------------------'),nl,
    nl,nl.

% Displays final score information
display_final_scores(O-G-Z):-
    write('                     F I N A L  S C O R E S     '),nl,
    write('               ---------------------------------'),nl,
    write('                        ORCS: '), write(O),nl,
    write('                        GOBLINS: '), write(G),nl,
    write('                        ZOMBIES: '), write(Z),nl,
    write('               ---------------------------------'),nl.
   


% ---------------------------- Winner Information -----------------------------
% Displays winner
display_winner(o):-
    write('                     W I N N E R:  O R C S     '),nl,
    nl,nl,nl.

display_winner(g):-
    write('                   W I N N E R:  G O B L I N S     '),nl,
    nl,nl,nl.

display_winner(z):-
    write('                   W I N N E R:  Z O M B I E S     '),nl,
    nl,nl,nl.

% Displays tie between all 3 species
display_winner(t):-
    write('                       A L L  W I N N E R S     '),nl,
    nl,nl,nl.

% Displays tie between 2 species
display_winner(o-g):-
    write('            W I N N E R:  O R C S  &  G O B L I N S     '),nl,
    nl,nl,nl.

display_winner(o-z):-
    write('            W I N N E R:  O R C S  &  Z O M B I E S     '),nl,
    nl,nl,nl.

display_winner(g-z):-
    write('          W I N N E R:  G O B L I N S  &  Z O M B I E S     '),nl,
    nl,nl,nl.



% ---------------------------- Display Game Over -----------------------------------
% Displays game over message
display_game_over :- 
    nl, 
    write('                        G A M E  O V E R'),nl,nl.

% -------------------------------- Value Menu ---------------------------------

% Displays value information
display_value(o,Value):-
    nl,nl,
    write('                             V A L U E       '),nl,
    write('               ---------------------------------'),nl,
    
    write('                        ORCS: '), write(Value),nl,
    write('               ---------------------------------'),nl,
    nl,nl.

display_value(g,Value):-
    nl,nl,
    write('                             V A L U E       '),nl,
    write('               ---------------------------------'),nl,
    write('                        GOBLINS: '), write(Value),nl,
    write('               ---------------------------------'),nl,
    nl,nl.

display_value(z,Value):-
    nl,nl,
    write('                             V A L U E       '),nl,
    write('               ---------------------------------'),nl,
    write('                        ZOMBIES: '), write(Z),nl,
    write('               ---------------------------------'),nl,
    nl,nl.