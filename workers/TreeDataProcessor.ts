/*
 * @Description:TreeDataProcessor
 * @Author: SZEWEC
 * @Date: 2021-09-16 14:55:14
 * @LastEditTime: 2022-06-14 11:04:15
 * @LastEditors: Sam
 */

import { BaseTreeNodeProps } from "../commons";


/**
 * 将组织树与分类树关联到dataList中
 */
export interface TreeDataProcessorProps {

	/**tree key字段名 */
	key:string;

	/**标题 */
	titleKey:string;

    /**父级的层级，懒加载需要添加此属性 */
    parentLevel?:number;

    /**父级的位置，懒加载需要添加此属性 */
    parentPosition?:number[];

	/**原始数据 */
	treeData:BaseTreeNodeProps[];
}

/**key属性名称 */
let key = '';

/**title属性名称 */
let titleKey = '';



/**递归生成antd的树结构 */
const loopData = (tree:BaseTreeNodeProps[], flattenList:BaseTreeNodeProps[], parentPosition:number[], level:number)=>{
    level++;
	tree.map((node:BaseTreeNodeProps, index:number)=>{
		const keyValue = node[key as keyof BaseTreeNodeProps] as string;
		const titleValue = node[titleKey as keyof BaseTreeNodeProps] as string;
		node.key =  keyValue;
		node.title =  titleValue;
        node.value = keyValue;
        node.isLeaf = node.leaf;
        flattenList.push(node);
        node.position = [...parentPosition, index];
        node.level = level;
		if(node.children){
			loopData(node.children!, flattenList, node.position, level);
		}
	});
    level--;
}

/**
 * 将后端返回的树形数据，转换为antd可识别的数据
 * @param message
 */
self.onmessage = (message:MessageEvent<TreeDataProcessorProps>)=>{
	const { data } = message;
	key = data.key;

    /**扁平化的节点列表 */
    const flattenList:BaseTreeNodeProps[] = [];
	titleKey = data.titleKey;
	const treeData = data.treeData;
    let level = data.parentLevel ?? 0;
    let parentPosition:number[] = data.parentPosition ?? [0];
	loopData(treeData as BaseTreeNodeProps[],  flattenList, parentPosition, level);
	self.postMessage({treeData, flattenList});
}
