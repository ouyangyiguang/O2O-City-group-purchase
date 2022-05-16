import {
	SOCKET_URL
} from '@/env'
import store from '@/common/store'
import api from '@/common/request/index'
class socket {
	constructor(options) {
		//地址
		this.socketUrl = SOCKET_URL;
		this.socketStart = false;
		this.monitorSocketError();
		this.monitorSocketClose();
		this.socketReceive();
	}
	init(callback) {
		const _this = this;
		console.log('initsocket',this)
		if (SOCKET_URL) {
			if(this.socketStart){
				console.log('webSocket已经启动了');
			}else{
				uni.connectSocket({
					url: this.socketUrl,
					method: 'GET'
				});
				uni.onSocketOpen((res) => {
					this.socketStart = true;
					callback && callback();
					console.log('WebSocket连接已打开！');
				});
				setTimeout(() => {
					_this.getHeartbeat();
				}, 8000);
			}
		}else{
			console.log('config/baseUrl socketUrl为空');
		}
	}
	//Socket给服务器发送消息
	send(data, callback) {
		const _this = this;
		if (store.state.user.userInfo.users_id) {
			data.users_id = store.state.user.userInfo.users_id;
		}else{
			data.users_id = "0";
		}
		//console.log(data);
		uni.sendSocketMessage({
			data: JSON.stringify(data),
			success: () => {
				callback && callback(true);
			},
			fail: () => {
				callback && callback(false);
			}
		});
	}
	//Socket接收服务器发送过来的消息
	socketReceive() {
		const _this = this;
		uni.onSocketMessage(function(e) {
			if (e.data){
        

		var data = JSON.parse(e.data)
	//console.log('接收到：',data);
        switch(data['type']){
            // 服务端ping客户端
			case 'binan':
				_this.acceptMessage && _this.acceptMessage(data);
			break;
            case 'ping':
                //ws.send('{"type":"pong"}');
				store.commit('setChatmsgnoread', data.isnoread);
				_this.acceptMessage && _this.acceptMessage(data);
                break;
            // 登录 更新用户列表
            case 'login':
                //{"type":"login","client_id":xxx,"client_name":"xxx","client_list":"[...]","time":"xxx"}
                 _this.say(data['client_id'], data['client_name'],  data['client_name']+' 加入了聊天室', data['time']);
                // if(data['client_list'])
                // {
                //     //client_list = data['client_list'];
                // }
                // else
                // {
                //     //client_list[data['client_id']] = data['client_name']; 
                // }
                _this.flush_client_list();
                console.log(data['client_name']+"登录成功");
				_this.acceptMessage && _this.acceptMessage(data);
                break;
            // 发言
            case 'say':
                //{"type":"say","from_client_id":xxx,"to_client_id":"all/client_id","content":"xxx","time":"xxx"}
                //_this.say(data['from_client_id'], data['from_client_name'], data['content'], data['time']);
				_this.acceptMessage && _this.acceptMessage(data);
                break;
            // 用户退出 更新用户列表
            case 'logout':
                //{"type":"logout","client_id":xxx,"time":"xxx"}
                // _this.say(data['from_client_id'], data['from_client_name'], data['from_client_name']+' 退出了', data['time']);
                // delete client_list[data['from_client_id']];
                // _this.flush_client_list();
				break;
        }
		
				
			}
		});
	}

   // 刷新用户列表框
     flush_client_list(){

    }

    // 发言
    say(from_client_id, from_client_name, content, time){

	}

	//关闭Socket
	closeSocket() {
		uni.closeSocket();
		_this.socketStart = false;
	}
	//监听Socket关闭
	monitorSocketClose() {
		const _this = this;
		uni.onSocketClose(function(res) {
			console.log('WebSocket 已关闭！');
			_this.socketStart = false;
			setTimeout(function() {
				_this.init();
			}, 3000);
		});
	}
	//监听Socket错误
	monitorSocketError() {
		const _this = this;
		uni.onSocketError(function(res) {
			_this.socketStart = false;
			console.log('WebSocket连接打开失败，请检查！');
		});
	}
	//心跳
	getHeartbeat() {
		const _this = this;
		this.send({
			type: "ping",
			users_id: store.state.user.userInfo.users_id
		}, (val) => {
			setTimeout(() => {
				if (val) {
					_this.getHeartbeat();
				} else {
					_this.init();
				}
			}, 8000);
		});
	}
};
const mySocket = new socket();
export default mySocket;
