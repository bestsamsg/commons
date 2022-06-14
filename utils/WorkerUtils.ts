/*
 * @Description:WorkerUtils
 * @Author: SZEWEC
 * @Date: 2021-09-16 15:08:03
 * @LastEditTime: 2022-06-14 10:47:09
 * @LastEditors: Sam
 */

import TreeDataProcessor from 'worker-loader!../workers/TreeDataProcessor';
import { BaseTreeNodeProps } from '../commons';


export interface ThreadProps{
    busy:boolean;
    worker:Worker;
}

/**线程工具 +*/
export namespace WorkerUtils{

    /**workers */
    const treeThreads:ThreadProps[] = [];

    /**创建worker */
    const createTreeWorker = ()=>{
        if(treeThreads.length) return;
        treeThreads.push({
            busy:false,
            worker:new TreeDataProcessor(),
        });
        treeThreads.push({
            busy:false,
            worker:new TreeDataProcessor(),
        });
        treeThreads.push({
            busy:false,
            worker:new TreeDataProcessor(),
        });
    }

    /**获取空闲的线程 */
    const getTreeThread = ():Promise<ThreadProps>=>{
        return new Promise(resolve=>{
            const id = requestAnimationFrame(()=>{
                for(const item of treeThreads){
                    if(!item.busy){
                        cancelAnimationFrame(id);
                        resolve(item);
                        break;
                    }
                }
            });
        });
    }

	/**
	 * 处理结构树数据为适用于ant-tree的数据格式
	 * @param treeData
	 * @returns
	 */
	export const processTreeData = async (treeData:BaseTreeNodeProps[], parentPosition?:number[], parentLevel?:number)=>{
        createTreeWorker();
        return new Promise<{treeData:BaseTreeNodeProps[]}>( async (resolve, reject)=>{
            const thread = await getTreeThread();
            thread.busy = true;
            thread.worker.postMessage({treeData:[...treeData], parentPosition, parentLevel, key:'id', titleKey:'name'});
            thread.worker.onmessage = ({data})=>{
                resolve(data);
                thread.busy = false;
            }
            thread.worker.onerror = (e)=>{
                console.log(e, 'e')
                reject(e);
                thread.busy = false;
            }

        });
	}

    /**终止treeWorker  */
    export const terminateTreeWorker = ()=>{
        treeThreads.forEach(thread=>{
            thread.worker.terminate();
        });
        treeThreads.length = 0;
    }
}
