
var port = 8124;

//---------------------------------------------------------------------------
var net = require('net');
var CPPHOST = '192.168.30.80';
var CPPPORT = 9876;

var tcpClientObject = new net.Socket();

tcpClientObject.on('data', function(data) {
    var temp = JSON.parse(data);
    console.log('[TCP\t] Data Received From TCP' +  JSON.stringify(temp));
    FromCore(temp);
});

connectToTCPServer = function (){
    tcpClientObject.connect(CPPPORT, CPPHOST, function() {
    });
};
var io = require('socket.io').listen(5000);

connectToTCPServer();

io.sockets.on('connection', function (caller) {
	var retdata = {};
	retdata.success = 1;
	retdata.replyof = 'welcome';
	retdata.msg = 'welcome user';
	caller.on('disconnect', function () {
		"disconnected";
	});
	caller.on('message', function (data) {
	    	var jsonData = data;
		var jsonArr = JSON.parse(jsonData);
		FromUI(jsonArr,caller);
	    });
	caller.on('start_game', function (data) {
		console.log("client connected " + JSON.stringify(data))
    	var jsonData = data;
		//var jsonArr = JSON.parse(jsonData);
		FromUI(data,caller);
//		tcpClientObject.write(JSON.stringify(jsonArr));
    	});
	});
io.sockets.on('disconnect',function(caller) {
	console.log("client disconnected");
});

FromCore = function(jsonArr){	
	console.log("[FROM CORE]" + JSON.stringify(jsonArr));
	io.sockets.emit(jsonArr.method,jsonArr);
};

FromUI = function (jsonArr,caller) {
	console.log("[FROM UI]" + JSON.stringify(jsonArr.method));
	var arr ={};
	arr.d_ch = "s";
	arr.s_ch = "s";
	arr.reply = false;
	arr.method = "start_game";
	arr.msg_type ="request";
	arr.data = {};
	arr.data = jsonArr;
	tcpClientObject.write(JSON.stringify(arr));
};

