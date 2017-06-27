var csrf = document.cookie.split(';').find(function(item){ return item.split('=')[0].indexOf('csrftoken') !== -1 }).split('=')[1];

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
