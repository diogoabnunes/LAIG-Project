:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8000).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

:- consult('game.pl').

parse_input(handshake, handshake).
% parse_input(test(C,N), Res) :- test(C,Res,N).

%vê se a peça é valida
%Response true-> peça valida; Response false-> peça invalida
parse_input(valid(Board,Player,Row,Column),Response):-
	valid_piece(Board,Player,Row,Column,Response).

%vê se a jogada é valida e faz as alteraçes necessárias, retornando um novo GameState
%Response true-> jogada valida; Response false-> jogada invalida
parse_input(movePiece(Board-[PO,PG,PZ]-Player-GreenSkull,RowPiece-ColumnPiece,Row-Column),Response-NewBoard-PO1-PG1-PZ1-ListEat-NewGreenSkull-MoveType):-
 move(Board-[PO,PG,PZ]-Player-GreenSkull, RowPiece-ColumnPiece-Row-Column-MoveType, NewBoard-[PO1,PG1,PZ1]-ListEat-NewGreenSkull,Response).

%vê se a peça escolhida é valida 
parse_input(inListEat(Row-Column,RowPiece-ColumnPiece-Board),Response):-
	get_move_eat(RowPiece, ColumnPiece, ListEat, Board),
	is_member([Row, Column], ListEat,Response).

%verifica se o jogo acabou
parse_input(isOver(Board),Response):-
	is_over(Board,Response).

%faz update das scores depois do jogo acabar, ao contar as peças que estão no lado correspondente
parse_input(finalScores(Board-[PO,PG,PZ]),PO1-PG1-PZ1):-
	final_scores(Board-[PO,PG,PZ],[PO1,PG1,PZ1]).

%vê qual é a especie vencedora
parse_input(getWinner(PO1-PG1-PZ1),Winner):-
	get_winner(PO1-PG1-PZ1,Winner).

%escolhe randomly uma peça da especie do player para mover
parse_input(findPiece(Board,Player),Row-Column):-
    find_piece(Board,Player,Row-Column).

%escolhe randomly uma casa para mover a peça
parse_input(findMove(Board,RowPiece-ColumnPiece),Row-Column):-
    find_move(Board,RowPiece-ColumnPiece,Row-Column).

%retorna uma lista composta com as celulas de destino válidas
parse_input(validMoves(Board,Row,Column),ListAdjacentMoves-ListEatMoves):-
	valid_moves(Board, _-Row-Column, ListAdjacentMoves-ListEatMoves).

parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
	