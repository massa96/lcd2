<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title></title>
<script type="text/javascript" src="/socket.io/socket.io.js"> </script>

<style>
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
</head>
<body>
  <label class="switch">
  <input type="checkbox">
  <span class="slider round"></span>
</label>

<label class="switch">
  <input type="checkbox" checked>
  <span class="slider round"></span>
</label>

<script type="text/javascript" >
var socket = io();
window.addEventListener("load", function () {
	  var lightbox = document.getElementById("led");
	  lightbox.addEventListener("change",function () {
	  	 socket.emit("led",Number(this.checked));
	  	 	});
});
socket.on("led",function (data) {
	document.getElementById("led").checked= data;
	socket.emit("led",data);
});
</script>
</body>
</html>
///////////////////////////////////////////////////////////////////////

var app = require("express")();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var LED = new Gpio(4,'out');
var btn = new Gpio(17,'in','both');

app.get('/',function (req,res) { res.sendFile('home/pi/Public/projet.html');});

io.on('connection', function (socket) {
      console.log("un utilisateur est connecté");
    io.on('disconnect', function (socket) {
      console.log("un utilisateur est deconnecté");
});
var ValeurLed = 0;
btn.watch(function (err,value) {
if (err) {
   console.error("Il y a une erreur",err);
   return;
}
 ValeurLed = value;
 socket.emit('led',ValeurLed);
});
 
 socket.on('led',function (data) {
 ValeurLed = data;
 if(ValeurLed !=LED.readSync()){
 LED.writeSync(ValeurLed);
 console.log(ValeurLed);
  }
  });
 });
 process.on('SIGINT'function () {
   LED.writeSync(0);
   LED.unexport();
   btn.unexport();
   process.exit();
 });
 http.listen('8080',function () {
   console.log("Ecoute sur *8080");
 });
 
 
 
 
