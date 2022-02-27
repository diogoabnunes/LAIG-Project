% --------------------------- Scores -------------------------
% PO - Orcs' initial score
% PG - Goblins' initial score
% PZ - Zombies' initial score
% ------------
% PO1 - Orcs' updated score
% PG1 - Goblins' updated score
% PZ1 - Zombies' updated score

% Changes Orcs' score
change_score([PO,PG,PZ]-o-Elem,[PO1,PG1,PZ1]):-
    Elem \== e, 
    Elem \== o, 
    PO1 is PO+1,
    PG1 is PG,
    PZ1 is PZ.

% Changes Goblins' score
change_score([PO,PG,PZ]-g-Elem,[PO1,PG1,PZ1]):-
    Elem \== e, 
    Elem \== g, 
    PO1 is PO,
    PG1 is PG+1,
    PZ1 is PZ.

% Changes Zombies' score
change_score([PO,PG,PZ]-z-Elem,[PO1,PG1,PZ1]):-
    Elem \== e, 
    Elem \== z, 
    PO1 is PO,
    PG1 is PG,
    PZ1 is PZ+1.

% Updates scores without changing
change_score([PO,PG,PZ]-_-_,[PO1,PG1,PZ1]):-
    PO1 is PO,
    PG1 is PG,
    PZ1 is PZ. 


% Final scores, depending on the number of the elements in their correspondent lines
final_scores(GameState-[PO,PG,PZ],[PO1,PG1,PZ1]):-
    orcs_final_score(GameState,PO,PO1),
    goblins_final_score(GameState,PG,PG1),    
    zombies_final_score(GameState,PZ,PZ1).
    
% Gets the score of the orcs in their final line (column index = 1)
orcs_final_score(GameState,PO,PO1):-
    get_left_diagonal(GameState,1,1,L),
    orcs_in_line(L,N),
    PO1 is PO+(2*N).

% Gets the score of the goblins in their final line (row number = Column index)
goblins_final_score(GameState,PG,PG1):-
    goblins_line(GameState,1,L),
    goblins_in_line(L,N),
    PG1 is PG+(2*N).

% Gets the score of the zombies in their final line (row = 10)
zombies_final_score(GameState,PZ,PZ1):-
    nth1(10,GameState,L),
    zombies_in_line(L,N),
    PZ1 is PZ+(2*N).



% ------------------------ Auxiliar functions ---------------------
% Auxiliar function to see how many orcs are in their line
orcs_in_line([],0).
orcs_in_line([E|R],N):-
    E==o,
    orcs_in_line(R,N1),
    N is N1+1.
orcs_in_line([_|R],N):-
    orcs_in_line(R,N).

% Auxiliar function to see how many goblins are in their line
goblins_line(GameState,Indice,[L1|R]):-
    Indice=<10,
    nth1(Indice,GameState,L),
    nth1(Indice,L,L1),
    Indice1 is Indice+1,
    goblins_line(GameState,Indice1,R).
goblins_line(_,11,[]).

% Another auxiliar function to see how many goblins are in their line
goblins_in_line([],0).
goblins_in_line([E|R],N):-
    E==g,
    goblins_in_line(R,N1),
    N is N1+1.
goblins_in_line([_|R],N):-
    goblins_in_line(R,N).

% Auxiliar function to see how many zombies are in their line
zombies_in_line([],0).
zombies_in_line([E|R],N):-
    E==z,
    zombies_in_line(R,N1),
    N is N1+1.
zombies_in_line([_|R],N):-
    zombies_in_line(R,N).