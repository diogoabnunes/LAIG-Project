:-use_module(library(lists)).


% Checks if value of a number is a integer (ex: 7.0 -> true)
is_int(Number) :-
    % Intermidiate is Number mod 1
    Intermidiate is abs(Number - round(Number)),
    \+ Intermidiate > 0.


% Replaces the element in the position Index of a list List by the value Value.
% Places the result in variable NewList
% replace(List, Index, Value, NewList)
replace([_|T], 1, X, [X|T]).
replace([H|T], I, X, [H|R]):-
        I > -1, 
        NI is I-1,
        replace(T, NI, X, R), !.
replace(L, _, _, L).


% Checks if a list is empty
is_empty([]).


% Checks if Element is member of a certain list
% is_member(Element, List)
is_member(_, []) :- fail.
is_member(Element, [Element | _]).
is_member(Element, [_ | Rest]) :- is_member(Element, Rest).
is_member(_, [],false) :- fail.
is_member(Element, [Element | _],true).
is_member(Element, [_ | Rest],R) :- is_member(Element, Rest,R).


% Writes a message and reads input from user (Row and Column)
input_play(Message,Row,Column) :-
    write(Message),nl,
    write('Row: '), read(Row),
    write('Column: '), read(Column),nl.

% Writes a message and reads input from user (Response)
input_message(Message,Response) :-
    write(Message),nl, read(Response), nl.


% Gets left diagonal of the board with column number = Indice
get_left_diagonal(GameState,Indice,N,[L1|R]):-
    nth1(N,GameState,L),
    nth1(Indice,L,L1),
    N1 is N+1,
    get_left_diagonal(GameState,Indice,N1,R).
get_left_diagonal(_,_,11,[]).


% Gets right diagonal of the boad with column number N - Indice + 1
get_right_diagonal(GameState,Indice,N,[L1|R]):-
    nth1(N,GameState,L),
    NewIndice is N-Indice+1,
    nth1(NewIndice,L,L1),
    N1 is N+1,
    get_right_diagonal(GameState,Indice,N1,R).
get_right_diagonal(_,_,11,[]).

% Generates random numbers between N  and R
get_random(N,R):-random(1,N,R).
get_random(1,1).

