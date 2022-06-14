/*
 * @Description:Socket
 * @Author: SZEWEC
 * @Date: 2021-09-23 16:24:00
 * @LastEditTime: 2022-04-27 20:30:21
 * @LastEditors: Sam
 */

import Q from 'q';

/**socket参数属性 */
export interface SocketProps{

    /**token */
    token?:string;

    /**地址 */
    url:string;

    /**返回的数据类型 */
    binaryType?:BinaryType;

    /**链接丢失后重连次数 */
    reconnectTimesAfterClose?:number;
}

/**
 * Socket
 */
export class Socket<R = any, S = any>{
    private _url:string;
    private _binaryType:BinaryType;
    private _ws!:WebSocket;
    private _token?:string;
    private _isConnected = false;
    private _isAuthorized = false;
    private _defer = Q.defer();
    private _timer:any;
    private _reconnectTimesAfterClose?:number;
    private _reconnectTimes?:number;

    /**
     * 初始化承诺，token校验通过后resolve
     */
    public get defer(){
        return this._defer;
    }

    /**地址 */
    public get url(){
        return this._url;
    }
    public constructor(props:SocketProps){
        this._url = props.url;
        this._token = props.token;
        this._binaryType = props.binaryType ?? 'arraybuffer';
        this._reconnectTimesAfterClose = props.reconnectTimesAfterClose;
        this._reconnectTimes = this._reconnectTimesAfterClose;
        this._initialize();
    }

    /**
     * 消息回调
     * @param evt
     */
    private _onMessage(evt:MessageEvent){
        const { data } = evt;
        if(data === '...'){
            return;
        }
	    const isResponseString = typeof data === 'string';

        let returnData:any = data;

        /**是一个json字符串，就格式话 */
        if(isResponseString && /(^\{.*\}$)|(^\[.*\]$)/igm.test(data)){
			returnData = JSON.parse(data) as R;
		}
		if(!this._isAuthorized && this._token){
            if(returnData && returnData.code === 'SUCCESS'){
                this._isAuthorized = true;
                this._heartBeat();
                this._defer.resolve(returnData.code);
            }else{
                this._defer.reject(returnData.code);
            }

            /**未授权前，不返回任何数据 */
            return;
		}
        this.onMessage(returnData);
    }

    /**
     * 消息回调
     * @param data
     */
    public onMessage(data:R){}

    /**
     * 发送数据
     * @param data
     */
    public send(data:S){
        let sendData:any = data;
        if(typeof data === 'object'){
            sendData = JSON.stringify(data);
        }
        this._ws.send(sendData);
    }
    private _initialize(){
        this._ws = new WebSocket(this._url);
        this._ws.binaryType = this._binaryType;
        this._ws.onmessage = this._onMessage.bind(this);

        //添加事件监听
        this._ws.onopen = ()=>{
            this._isConnected = true;
            if(this._ws?.readyState !== 1) return;
            if(this._token){
                const data = JSON.stringify({token:this._token});
                this._ws!.send(data);
            }else{
                this._isAuthorized = true;
                this._heartBeat();
                this._defer.resolve('SUCCESS');
            }
        }

        this._ws.onclose = ()=>{

            /**打开链接不一定true, 但掉线必定是false */
            this._isConnected = false;
            if(!!this._reconnectTimesAfterClose && !!this._reconnectTimes){
                if(this._reconnectTimes > 0){

                }
            }
            this.onClose();
            self.postMessage({code:'CLOSE', massage:'通道已经关闭'});
        };
        this._ws.onerror = ()=>{
            this.onClose();
        }
    }

    /**链接自动关闭回调 */
    public onClose(){}

    /**心跳保持链接 */
    private _heartBeat(){
        const second = 1000;
        this._timer = setInterval(()=>{
            this._ws.send('...');
        }, 20 * second);
    }

    /**关闭链接 */
    public close(){
        this._ws.close();
        clearInterval(this._timer);
    }
}
