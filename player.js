var player=document.getElementById("player");
var seekbar = document.getElementById('seekbar');
var currentduration = document.getElementById('current-duration');
var rangevolume = document.getElementById('range-volume');
var volumestatus = document.getElementById('volume-status');

player.volume = 0.5;
volume()
var isPlaying = false;

//window.addEventListener('load', play()); // iniciando o player caso o navegador permita

function play(){
    player.play();
    document.getElementById('btn-play-stop').src = "./icons/stop.png"
    this.isPlaying = true;
    switch(player.networkState){ //verificando status do player
        case 0:
            console.log('Não há dados ainda. Além disso, readyState é HAVE_NOTHING.');
            break;
        case 1:
            console.log('HTMLMediaElement está ativo e selecionou um recurso, mas não está usando a rede.');
            break;
        case 2:
            console.log('Carregando a Rádio');
            document.getElementById('btn-play-stop').src = "./icons/stop.png"
            this.isPlaying = true;
            break;
        case 3:
            console.log('Servidor não encontrado.');
            break;
        default:
            console.log('Erro ao Reproduzir a Rádio!');
            break;
    }
}
function pause(){
    player.pause();
    document.getElementById('btn-play-stop').src = "./icons/play.png"
    this.isPlaying = false;
    console.log('Pausando a Rádio');
}
function playPause(){
    if(isPlaying){
        this.pause();
    }else{
        this.play();
    }
}

function mutarDesmutar(){
    if(player.volume == 0){
        player.volume = 0.5;
        document.getElementById('btn-mutar-desmutar').src = "./icons/volume.png"
        volume();
    }else{
        player.volume = 0;
        document.getElementById('btn-mutar-desmutar').src = "./icons/mute.png"
        volume();
    }
}

function aumentarVolume(){
    player.volume+=0.1;
    console.log('Aumentando o volume da Rádio');
    volume();
}
function diminuirVolume(){
    player.volume-=0.1;
    console.log('Diminuindo o volume da Rádio');
    volume();
}
function volumeMax(){
    player.volume-=1;
    console.log('Volume máximo');
    volume();
}
function mute(){
    player.volume=0;
    console.log('Mutando o Som');
    volume();
}
function volume(){
    var volume = player.volume*100;
    rangevolume.value = player.volume;
    console.log('Volume da rádio: ' + volume.toFixed(0) + '%');
    this.volumestatus.innerHTML = volume.toFixed(0) + '%';
}
function currentTime(){ //tempo atual da fonte
    console.log(player.currentTime());
}

function musicaAtual(){
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.onreadystatechange = function(){
        switch(ajaxRequest.readyState){
            case 1:
                console.log("Established server connection.");
                break;
            case 2:
                console.log("Request received by server.");
                break;
            case 3:
                console.log("Processing request.");
                break;
            case 4:
                if(this.status == 200){
                    console.log("Consultando nome da música");
                    var obj = JSON.parse(ajaxRequest.responseText);
                    var nomedamusica = obj.data[0].song;
                    console.log("Tocando: " + nomedamusica);
                    document.getElementById('musica-atual').innerHTML = nomedamusica;
                    //console.log(obj.data[0].track.imageurl); //imagem da música
                    if(obj.data[0].track.imageurl){
                        document.getElementById('music-image').src = obj.data[0].track.imageurl;
                    }
                    
                }else{
                    console.log("Status error: " + ajaxRequest.status);
                }
                break;
            default:
                console.log("Something went wrong. :(");
                break;
        }


        
    }
    ajaxRequest.open("GET", "https://r6.ciclano.io:2199/rpc/radiobwr/streaminfo.get", true);
    ajaxRequest.send();
}

/*function segParaHora(time, with_seg = true){
    
    var hours = Math.floor( time / 3600 );
    var minutes = Math.floor( (time % 3600) / 60 );
    var seconds = time % 60;
      
    minutes = minutes < 10 ? '0' + minutes : minutes;      
    seconds = seconds < 10 ? '0' + seconds : seconds;
    hours = hours < 10 ? '0' + hours : hours;
      
    if(with_seg){
       return  hours + ":" + minutes + ":" + seconds.toFixed(0);
    }
      
    return  hours + ":" + minutes;
  }*/
      
  function segundosParaHora(seg) {
    var horas = Math.floor(seg/(60*60));

    var resto = seg % (60*60);
    var minutos = Math.floor(seg/60);

    resto %= 60;
    segundos = Math.ceil(resto);

    /*if(horas > 0 && horas < 10){
        horas="0"+horas;
    }
    if(minutos > 0 && minutos < 10){
        minutos="0"+minutos;
    }
    if(segundos > 0 && segundos < 10){
        segundos="00:0"+segundos;
    }*/
    
    var hora = {
        "H": horas+"h",
        "i": minutos+"m",
        "s": segundos+"s"
    };

    console.log(hora);
    return hora;
}


function atualizadadosplayer(){ //atualizando dados do player
    //this.seekbar.max = this.player.duration; infinito
    this.seekbar.min = this.player.min;
    this.seekbar.max = this.player.duration;
    this.seekbar.value = this.player.currentTime;
    hora = segundosParaHora(this.player.currentTime);
    console.log(hora.H);
    if(hora.H != 0){
        console.log('chegou');
        this.currentduration.innerHTML = hora.H +":"+ hora.i +":"+ hora.s;
    }else if(hora.i != 0){
        console.log('chegou')
        this.currentduration.innerHTML = hora.i +":"+ hora.s;
    }else{
        this.currentduration.innerHTML = hora.s;
    }
}

seekbar.addEventListener("input", function(){
    player.currentTime = this.value;
});
rangevolume.addEventListener("input", function(){
    player.volume = this.value;
    volume();
});


setInterval("musicaAtual()", 3000); // chamando a função para atualizar o nome da música
setInterval("atualizadadosplayer()", 600); // atualizando dados do player



