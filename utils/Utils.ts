/*
 * @Description: Utils
 * @Author: SZEWEC
 * @Date获取url参数: 2021-09-13 11:19:20
 * @LastE dva reduxditTime: 2021-09-26 18:28:57
 * @LastEditors: Sam
 */
import { getDvaApp } from 'umi';
import { AnyAction, BaseTreeNodeProps, KVObject, StoreStateProps } from '../commons';

/**
 * 工具类
 */
export namespace Utils {

    /**动态宽度计算 */
    const textDiv = document.createElement('span');
    document.documentElement.appendChild(textDiv);
    textDiv.style.visibility = 'hidden';
    textDiv.style.opacity = '0';

    /**
     * 测量字符串宽度
     * @param text
     * @param font
     */
    export const getTextWidth = (text:string, font:string)=>{
        if(!text) return 0;
        textDiv.style.fontSize = font;
        textDiv.innerHTML = text;
        return textDiv.offsetWidth;
    }

    /**
     * 将string[]转{[key:string]:boolean}
     * @param keyArray
     */
    export const getObjFromKeyArray = (keyArray:string[]):KVObject=>{
        const obj:KVObject = {};
        if(!keyArray) return obj;
        keyArray.map(key=>{
            obj[key] = true;
        });
        return obj;
    }

    /**
     * 获取对象key数组
     * @param obj
     */
    export const getObjKeys = (obj:KVObject):string[]=>{
        if(!obj) return [];
        return Object.keys(obj);
    }

    /**
     * 深度赋值对象
     * @param obj
     */
    export const deepCopyObj = <T extends KVObject>(obj:T):T=>{
        return JSON.parse(JSON.stringify(obj));
    }

    /**获取id */
    export const getId = ()=>{
        var s:any[] = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    /**
     * 判断obj是否是json对象
     * @param obj
     */
    export const isObject = (obj:any)=>{
        return Object.prototype.toString.call(obj) === "[object Object]";
    }

    /**
     * 判断obj是否为空
     * @param obj
     */
    export const isObjectEmpty = (obj:any)=>{
        if(!obj) return true;
        for(const key in obj){
            if(obj[key]){
                return false;
            }
        }
        return true;
    }

    /**
     * 获取file的base64
     * @param file
     */
    export const getBase64FromFile = (file:File)=>{
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    /**
     * 转换文件体积
     * @param size
     */
    export const transformFileSize = (size:number)=>{
        if(!size || size < 0) return '0 B';
        if(size < 1024){
            return size+' B';
        }
        if(size > 1024*1024*1024){
            return (size/(1024*1024*1024)).toFixed(2)+' GB';
        }
        if(size > 1024*1024){
            return (size/(1024*1024)).toFixed(2)+' MB';
        }
        if(size > 1024){
            return (size/1024).toFixed(2)+' KB';
        }
    }


    /**
     * 根据object创建一个formdata对象
     * @param obj
     */
    export const createFormData = (obj:KVObject)=>{
        const formData = new FormData();
        for(const key in obj){

            /**json */
            if(isObject(obj[key])){

                const value = JSON.stringify(obj[key]);
                formData.append(key, value);

            /**数组 */
            }else if(obj[key] instanceof Array){

                /**File数组 */
                if(obj[key][0] instanceof File){
                    obj[key].map((item:File)=>{
                        formData.append(key, item);
                    });
                    continue;
                }

                /**当对象处理 */
                const value = JSON.stringify(obj[key]);
                formData.append(key, value);


            /**普通字符串 */
            }else{
                obj[key] && formData.append(key, obj[key]);
            }
        }
        return formData;
    }

    /**
     * 通过position获取指定的节点
     * @param tree
     * @param position
     */
    export const getTreeNodeByPosition = (tree:BaseTreeNodeProps[], position:number[])=>{
        const posArray = position.slice(1);
        let targetNode:BaseTreeNodeProps|null = null;
        for(const index of posArray){
            if(targetNode){
                if(!targetNode.children || !targetNode.children[index]){
                    throw targetNode;
                }
            }
            targetNode = targetNode ? targetNode.children![index] : tree[index];
        }
        return targetNode;
    }

    /**
     * 通过指定节点id获取节点
     * @param tree
     * @param id
     */
    export const getTreeNodeById = (tree: BaseTreeNodeProps[], id?: string, key = 'id'): BaseTreeNodeProps | null => {
        if(!id) return null;
        const loop = (tree: BaseTreeNodeProps[]) => {
            tree.map(node => {
                if (node[key as keyof BaseTreeNodeProps] === id) {
                    throw node;
                }
                if (node.children) {
                    loop(node.children);
                }
            });
        }
        try {
            loop(tree);
        } catch (node) {
            return node;
        }
        return null;
    }


    /**
     * 获取父级id数组
     * @param tree
     * @param id
     */
    export const getTreeNodeParentIds = (tree: BaseTreeNodeProps[], longNumber: string) => {
        const numberArray = longNumber.split('!');
        const rootNumber = numberArray[0];
        const result: string[] = [];
        let parentNode = getTreeNodeById(tree, rootNumber, 'longNumber');
        if (!parentNode || numberArray.length === 1) {
            return undefined;
        }
        result.push(parentNode.id);
        if (numberArray.length == 2) {
            return result;
        }

        /**从第二个编码开始, 并且最后一个元素不能要，因为最后一个元素为节点本身 */
        for (let i = 1; i < numberArray.length - 1; i++) {

            /**如果父级节点不存在，直接中断 */
            if (!parentNode?.children) break;
            const node = parentNode.children.find(node => node.number === numberArray[i]) as BaseTreeNodeProps;
            if (!node) break;
            result.push(node.id);
            parentNode = node;
        }
        return result;
    }


    /**
     * 获取search参数值
     * @param key
     * @param search
     * @returns
     */
    export const getSearchKeyValue = (key?: string, search?: string) => {
        const result: KVObject = {};

        /**无search，则取url search */
        if (!search) {
            search = window.location.search;
        }
        if (!search) return result;

        /**单独取参数 */
        if (key) {
            const reg = new RegExp(`[\?|&]${key}=([^&]*)`, 'gm');
            const match = reg.test(search);
            if (match) {
                result[key] = RegExp.$1;
            }
            return result;
        }

        search = search.replace(/^\?/, '');
        if (!search) return result;

        /**['k=v', 'k1=v1', 'k2=v2'] */
        const keyAndValues = search.split('&');
        for (const keyValueString of keyAndValues) {

            /**['k', 'v'] */
            const keyValueArray = keyValueString.split('=');
            result[keyValueArray[0]] = keyValueArray[1];
        }
        return result;
    }

    /**
     * 通过返回一个函数，持续获取具体的类名
     * @param styles css模块
     * @param prefix 根样式
     */
    export const getStyles = (styles: KVObject, prefix: string) => {

        /**
         * @param className 子级样式
         * @param suffix 后缀样式类
         * @param ignoreParent 是否忽略父级，使用于&.actived这种情况
         */
        const getClass = (className?: string, suffix?: string, ignoreParent?:boolean) => {
            if (!className) {

                if (!suffix) return styles[prefix];
                return styles[prefix] + ' ' + suffix;
            }

            if(ignoreParent){
                return styles[className];
            }

            if (suffix) {
                return styles[prefix + className] + ' ' + suffix;
            }
            return styles[prefix + className];

        }
        return getClass;
    }

    /**
     * 格式化时间戳
     * @param timestamp
     * @param format
     */
    export const formatTimestamp = (timestamp: number, format: string) => {
        if (!format || !timestamp) {
            return false;
        }

        const date = new Date(timestamp);
        const map: KVObject = {
            M: date.getMonth() + 1, //月份
            d: date.getDate(), //日
            h: date.getHours(), //小时
            m: date.getMinutes(), //分
            s: date.getSeconds(), //秒
            q: Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds(), //毫秒
        };
        format = format.replace(/([yMdhmsqS])+/g, (all, t) => {
            let v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    }

    /**
     * 获取数据模型状态
     * @param name
     */
    export const getModelState = (name?:keyof StoreStateProps)=>{
        const storeState = getDvaApp()._store.getState() as StoreStateProps;
        if(name){
            return storeState[name];
        }
        return storeState;
    }

    /**
     * 派发Redux操作
     * @param action
     */
    export const dispatchAction = (action:AnyAction)=>{
        getDvaApp()._store.dispatch(action);
    }
}

