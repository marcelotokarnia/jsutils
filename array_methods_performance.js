function measure(f, name){
	arraymillion = [];
	for (var i=0; i<1000000; i++){
		arraymillion.push({});
	}
	t1 = performance.now();
	f();
	t2 = performance.now();
	console.log(name + ': ' + (t2 - t1));
}

function mmap(){
	arraymillion.map(function(obb){
		obb.mapped = true;
	});
}

measure(mmap, 'map');

function ffilter(){
	arraymillion.filter(function(obb){
		obb.filtered = true;
	});
}
measure(ffilter, 'filter');

function ssome(){
	arraymillion.some(function(obb){
		obb.somed = true;
	});
}

measure(ssome, 'some')

function rreduce(){
	arraymillion.reduce(function(prev, curr){
		curr.reduced = true;
	}, {});
}

measure(rreduce, 'reduce');

function normal_for(){
	for (var i = 0; i < arraymillion.length; i++){
		arraymillion[i].forred = true;
	}
}

measure(normal_for, 'normal_for');

function foreach(){
	arraymillion.forEach(function(item, index){
		item.foreached = true;
	});
}

measure(foreach, 'foreach');

function angforeach(){
	angular.forEach(arraymillion, function(item, index){
		item.angforeached = true;
	});
}

measure(angforeach, 'angforeach');


//this will output
// map: 206.32000000000698
// filter: 38.21999999997206
// some: 37.98499999998603
// reduce: 39.675000000046566
// normal_for: 16.024999999965075
// foreach: 38.56000000005588
// angforeach: 52.11000000004424

//so we can conclude most of the array methods have about the same performance
//if I rerun the scripts some positions might change
//but ultimately the normal_for is the most performatic and the map is the least
