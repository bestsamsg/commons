/*
 * @Description: Request
 * @Author: Sam
 * @Date: 2021-08-17 00:09:47
 * @LastEditTime: 2022-06-14 11:12:47
 * @LastEditors: Sam
 */

import Axios, { CancelTokenSource } from 'axios';
import qs from 'qs';
import { message } from 'antd';
import { getDvaApp } from 'umi';
import { KVObject } from '../commons';
Axios.defaults.timeout = 30000;
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const CancelToken = Axios.CancelToken;

/**免服务端校验返回类型 */
export enum ResponseType{
    JSON = 'json',
    BLOB = 'blob',
    TEXT = 'text'
}

/**请求方式 */
export enum MethodType{
    GET = 'get',
    POST = 'post',
}

/**提示类型 */
export enum ToastType {

    /**请求成功后无提示 */
    NONE,

    /**只提示成功消息 */
    SUCCESS,

    /**只提示请求网络正常情况下的失败消息 */
    FAIL,

    /**提示全部消息 */
    ALL,

    /**禁止500等服务端报错信息 */
    SUPPRESS
}

/**进度 */
export type TypeRequestProgressFunc = (progress:number)=>void;

/**请求参数 */
export interface RequestProps{

    /**请求方式 */
    method?:MethodType;

    /**服务端方法 */
    url:string;

    /**get参数 */
    params?:any;

    /**请求头 */
    headers?:{[key:string]:string},

    /**post参数 */
    data?:any;

    /**提示类型 */
    toast?:ToastType;

    /**根路径, 会覆盖Axios.default.baseURL */
    api?:string;

    /**返回的类型，区别于下载 */
    responseType?:ResponseType;

    /**取消方法名称 */
    cancelName?:string;

    /**进度，实参值为百分比 */
    onProgress?:TypeRequestProgressFunc;

    /**下载文件名 */
    downloadFileName?:string;

    /**token, 会覆盖sessionStorage.token */
    token?:string;

    /**超时, 默认30s */
    timeout?:number;

	/**取消凭据 */
    cancelToken?:CancelTokenSource;
}


/**请求模块 */
export namespace TypeRequest{

	/**默认参数 */
	const defaultRequestProps = {
		method:MethodType.GET,
		toast:ToastType.NONE,
	}

	/**获取取消器 */
	export const createCanceler = CancelToken.source();

	/**
	 * 请求接口
	 * ```
	 * const data:{result:LocalDataProps[]} = await Request({url:LOCAL_API+'/fileSync/checkModelExist', toast:ToastType.NONE, params:{geoKeys:geoKeys.join(',')}});
	 * ```
	 * @param requestProps
	 * @param successCode
	 * @returns
	 */
	export const fetch = <T = KVObject>(requestProps:RequestProps, successCode=['200', '201', '204', 'SUCCESS']):Promise<T>=>{
		requestProps = {...defaultRequestProps, ...requestProps};
		requestProps.api = requestProps.api;
		if (!requestProps.url) throw new Error('请指定url');

		/**post请求应该转为key=value的方式 */
		const isFormData = requestProps.data instanceof FormData;
		if(requestProps.method === MethodType.POST){
            requestProps.data = !isFormData ? qs.stringify(requestProps.data) : requestProps.data;
        }

        if(requestProps.method === MethodType.GET && typeof requestProps.params === 'object'){
            for(const key in requestProps.params){
                if(requestProps.params[key] === undefined){
                    requestProps.params[key] = '';
                }
            }
        }

		const cancelToken = requestProps?.cancelToken?.token;
		const instance = Axios.create({
			baseURL:requestProps.api,
			timeout:requestProps.timeout,
            onUploadProgress:(progressObj:{loaded:number, total:number})=>{
                const progress = Math.floor(100 * ( progressObj.loaded / progressObj.total ));
                requestProps.onProgress?.(progress);
            },
		});

		/**请求拦截器，添加请求头 */
		instance.interceptors.request.use(config=>{
			if(requestProps.headers){
				for(const k in requestProps.headers){
					config.headers[k] = requestProps.headers[k];
				}
			}

			/**附加authorization */
			const authorization = requestProps.token || getDvaApp()?._store.getState().global.token || sessionStorage.getItem('token');
			if(authorization){
				config.headers['Authorization'] = authorization;
			}

			/**下载 */
			if(requestProps.responseType === ResponseType.BLOB){
				config.headers['content-disposition'] = 'attachment, filename=data';
				config.headers['content-type'] = 'application/x-download, charset=utf-8';
			}

			/**html */
			if(requestProps.responseType === ResponseType.TEXT){
				config.headers['content-type'] = 'text/xml;charset=utf-8';
			}

			/**上传 */
			isFormData && (config.headers['content-type'] = 'multipart/form-data');
			return config;
		}, error=> {
			console.log(error, 'request')
			return Promise.reject(error);
		});

		/**返回拦截器 */
		instance.interceptors.response.use(response=> {
			return response;
		}, error=> {
			console.log(error, 'response')
			return Promise.reject(error);
		});

		const promise = new Promise<T>((resolve, reject)=>{
			instance.request({...requestProps, cancelToken:cancelToken}).then(res=>{
				if(res.status == 200 || res.status == 304){

					/**直接返回blob */
					if(res.data && requestProps.responseType === ResponseType.BLOB &&  res.data instanceof Blob){
						const link = document.createElement('a');
						link.href = window.URL.createObjectURL(res.data);
						link.download = requestProps.downloadFileName!;
						document.body.appendChild(link);
						const evt = document.createEvent('MouseEvents');
						evt.initEvent('click', false, false);
						link.dispatchEvent(evt);
						link.remove();
						return resolve(res.data as any);
					}

					/**直接返会json */
					if(res.data && requestProps.responseType === ResponseType.JSON){
						return resolve(res.data as T);
					}

					/**直接返回text */
					if(res.data && requestProps.responseType === ResponseType.TEXT){
						return resolve(res.data as T);
					}

					/**后端常规返回 */
					if(successCode.includes(res.data?.code)){
					[ToastType.ALL, ToastType.SUCCESS].includes(requestProps.toast!) && message.info(res.data.message && res.data.message || '请求成功');
						return resolve(res.data as T);
					}else{
						[ToastType.FAIL, ToastType.ALL].includes(requestProps.toast!) && message.warning(res.data.message && res.data.message || '请求错误');
						return reject(res.data as T);;
					}
				}
				message.error('请求失败');
				reject(res.data);
			}, async err=>{

				/**网络错误-边缘服务状态修改为空 */
				if(err.message === "Network Error"){

					![ToastType.SUPPRESS].includes(requestProps.toast!) &&
					message.error('网络错误');
					console.error(`request ${requestProps.url} failed.`);
					return reject(err);
				}

				/**请求超时 */
				if(err.message && err.message.includes('timeout')){
					![ToastType.SUPPRESS].includes(requestProps.toast!) &&message.error('请求超时');
					return reject(err);
				}

				/**请求被取消 */
				if(err?.code === 'ECONNABORTED'){
					![ToastType.SUPPRESS].includes(requestProps.toast!) &&message.error('请求被取消');
					return reject(err);
				}

				if(err?.response?.status){
					const status = err?.response?.status;

					/**接口不存在 */
					if(status === 404){
						![ToastType.SUPPRESS].includes(requestProps.toast!) && message.error('资源不存在');
						console.error(`request ${requestProps.url} failed.`);
						return reject(404);
					}

					/**无权限 */
					if(status === 401){
						if(![ToastType.SUPPRESS].includes(requestProps.toast!)){
							message.error('权限异常,即将重定向');
						}
						return reject(401);
					}

					/**客户端异常，包括了400, 403, 405 */
					if(status >= 400 && status < 500){
						![ToastType.SUPPRESS].includes(requestProps.toast!) && message.error('客户端异常');
					}

					/**服务端异常 */
					if(status >=500){
						![ToastType.SUPPRESS].includes(requestProps.toast!) && message.error('服务端异常');
					}
					return reject(status);
				}
			}).catch(e=>{
				console.log(e, 'catch')
				![ToastType.SUPPRESS].includes(requestProps.toast!) && message.error('服务端异常');
				return reject('服务端异常');
			});
		});
		return promise;
	}
}
