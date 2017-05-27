Como alguns já sabem, outros não, o Bruninho está concorrendo a uma cadeira de rodas iradíssima por essa promoção do instagram: 
https://www.instagram.com/p/BUhO1TNDCD0/
quem seguir esse passo a passo também estará concorrendo com chances um pouco mais elevadas que a média.
Meu plano é juntarmos forças para quem ganhar (se for do nosso grupo), entregar a cadeira para ele :) 
Para ajudar é muito simples:

1. Abra o Chrome (de preferência, talvez funcione em outro navegador).

2. Abra alguma página do instagram, repare que você PRECISA ESTAR LOGADO.

3. Abra alguma página com vários usuários diferentes, pode ser o seu feed, ou entra nos seus 'followers' ou os seus 'following' e da uma scrollada legal pra baixo até carregar bastante gente.

4. A partir daqui a mágica é comigo, vou ler todos os nomes de usuários da página que está no seu navegador e fazer os comentários na publicação que o bruninho está concorrendo a cadeira de rodas.

5. Aperte F12. Deve abrir uma pequena janela na parte de baixo do seu navegador, vá na aba 'Console', copie e cole o código abaixo e aperte ENTER. só isso.
Deixe a janela aberta um tempo, o computador irá postar vários comentários por você sem repetir os nomes que já foram colocados lá, pode manter o console aberto, que eu vou dando o status por lah.

PS: Esteja ciente de que o instagram tem uma política contra spams um pouco rigorosa, você fazer isso muitas vezes durante o dia pode fazer com que você tenha sua conta suspensa por 24h (ou seja, não poderá dar like, comentar ou fazer nenhuma outra ação). Mas é só por 24h e foi por uma boa causa. 

PS2: Você pode abrir a publicação em outra aba (link abaixo) ou no próprio celular, para ver seus comentários aparecendo magicamente a cada 45s. (eu colokei esse tempo alto pq antes estava sendo blokeado após o 4º comentário, o que não ajudaria muita coisa :( )
https://www.instagram.com/p/BUhO1TNDCD0/

PS3: No meio do processo pode aparecer uma mensagem que eu escrevi falando que você foi bloqueado, mas isso não significa que você foi bloqueado pelas 24h que eu mencionei ali em cima, você só foi bloqueado por alguns minutos. É um bloqueio leve, o bloqueio pesado só acontece se você insistir muito, e tomar vários bloqueios leves ehehhehe, o que eu pretendo fazer :p

Espero ter ajudado, qualquer dúvida podem me mandar msg no whatsapp 12 99648 6169 - Marcelo Tokarnia

/*-----------------------------------------------------------------------------------------------------------------------------*/

csrf = document.cookie.split(';').find(function(item){ return item.split('=')[0].indexOf('csrftoken') !== -1 }).split('=')[1];

function seguir(){
	var request = new XMLHttpRequest();
	request.open('POST', '/web/friendships/490896387/follow/', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.setRequestHeader('x-csrftoken', csrf);
	request.setRequestHeader('x-instagram-ajax', '1');
	request.setRequestHeader('x-requested-with', 'XMLHttpRequest');
	request.send();
}

function comentar(amigos, i){
	var request = new XMLHttpRequest();
	request.open('POST', '/web/comments/1522563384431354100/add/', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.setRequestHeader('x-csrftoken', csrf);
	request.setRequestHeader('x-instagram-ajax', '1');
	request.setRequestHeader('x-requested-with', 'XMLHttpRequest');
	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    console.log('comentou ' + comment_text);
	    var amigos_comentados = localStorage.getItem('amigoscomentados') ? localStorage.getItem('amigoscomentados').split(';') : [];
	    amigos_comentados.push(amigos[i], amigos[i+1]);
	    localStorage.setItem('amigoscomentados', amigos_comentados.join(';'));
	    setTimeout(function(){
		    if (i+3 < amigos.length){
				comentar(amigos, i+2);
			} else {
				console.error('ACABOU A LISTA DE USUÁRIOS, REPITA O PROCESSO!');
			}
		}, 45000);
	  } else {
	    console.error('VOCE FOI BLOKEADO ... ESPERE UM POUCO');
	  }
	};

	request.onerror = function() {
		console.error('VOCE FOI BLOKEADO ... ESPERE UM POUCO');
	};

	var comment_text = '@' + amigos[i] + ' @' + amigos[i+1];
	request.send('comment_text=' + comment_text);
}

function buscar_amigos(get_more){
	var amigos_comentados = localStorage.getItem('amigoscomentados') ? localStorage.getItem('amigoscomentados').split(';') : [];
	var amigos = localStorage.getItem('amigos') ? localStorage.getItem('amigos').split(';') : [];
	if (get_more){
		amigos = amigos.concat([...document.querySelectorAll('ul li a._4zhc5')].map(function(e){return e.innerText}).filter(function (item) {
    		return amigos.indexOf(item) < 0 && item !== 'mobilitybrasil';
		}));
	}
	amigos = amigos.filter(function(item){
		return amigos_comentados.indexOf(item) < 0;
	});
	localStorage.setItem('amigos', amigos.join(';'));
	console.info('CONSEGUI LER ' + amigos.length + ' USUARIOS NOVOS!');
	console.info('COMEÇANDO A COMENTAR... 1 comentário a cada 45s');
	return amigos;
}

seguir();
comentar(buscar_amigos(true), 0);
