/*
 * @Description:commons declare
 * @Author: SZEWEC
 * @Date: 2021-09-16 15:11:58
 * @LastEditTime: 2022-06-15 17:24:44
 * @LastEditors: Sam
 */

import { DataNode } from 'antd/lib/tree';
import { Model, EffectsCommandMap } from 'dva';
import { Action  } from 'umi';


/**基础树节点类型 */
export declare interface BaseTreeNodeProps extends DataNode{

    /**id */
    id:string;

    /**名称 */
    name:string;

    /**与id一致 */
    value:string;

    /**父级 */
    parentId?:string;

    /**编码 */
    longNumber:string;

    /**编码  */
    number:string;

    /**是否是叶子节点 */
    leaf:boolean;

    /**索引 */
    position:number[];

    /**创建时间 */
    creatTime?:string|number;

    /**层级 */
    level:number;

    /**子级 */
    children?:BaseTreeNodeProps[];
}

declare type KVObject = {[key:string]:any};
declare type TypeElement = JSX.Element|React.FC|string|number;
declare interface Window{
    getDvaApp:KVObject;
}

/**全局数据模型对象 */
declare interface StoreStateProps{

}

/**分页 */
export interface BasePageParams{
    currentPage:number;
    pageSize:number;
}

/**分页返回结果 */
declare interface PageResultProps<T = any>{
    result:{
        total:number;
        records:T[];
    }
}

/**分页返回结果 */
declare interface ResultProps{
    result:{
        message:string;
        code:string;
    }
}

export interface AnyAction<T = any> extends Action {
    payload?:T;
    [others: string]: any;
}

declare interface DvaApp{
    _store:{
        getState:()=>{};
        dispatch:Dispatcher;
    }
}

/**dispatch */
declare interface Dispatcher{
	dispatch:<T>(action: AnyAction<T>)=>any
}

interface PutActionProps{
	<A extends AnyAction>(action: A):any;
	resolve:<A extends AnyAction>(action: A) => any;
}


declare interface EXTEffectsCommandMap extends Omit<EffectsCommandMap, 'put'|'select'>{

	/**重写put类型 */
	put: PutActionProps;

	select:<T>(func: (state: StoreStateProps) => T) => T

	call: <R>(...arg:any[])=>R;
}


/**重写dva Model属性 */
declare interface DvaModelProps<S> extends Omit<Model, 'reducers'|'effects'>{

	/**state */
	state:S;

	/**重写effect，添加put.resolve */
	effects:{
		[key:string]:<T = any>(action:AnyAction<T>, effects: EXTEffectsCommandMap) => void;
	};

	/**setState<GlobalState>(state, paylaod) */
	reducers:{
		setState:(state:S, action:{type:string, payload:Partial<S>})=>S;
	};

}