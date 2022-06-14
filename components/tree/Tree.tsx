/*
 * @Description:Tree Module
 * @Author: SZEWEC
 * @Date: 2022-02-18 18:31:10
 * @LastEditTime: 2022-06-14 11:06:47
 * @LastEditors: Sam
 */
import React, { useState } from 'react';
import styles from './styles.less';
import { Popover, Tree as AntTree, TreeProps as AntTreeProps } from 'antd';
import { Utils } from '../../utils/Utils';
import { DataNode } from 'antd/lib/tree';
import classnames from 'classnames';
import { DownOutlined, MoreOutlined } from '@ant-design/icons';
import { Text } from '../text';
import { BaseTreeNodeProps } from '../../commons';

const getClass = Utils.getStyles(styles, 'tree');

/**点击更多阻止冒泡 */
const onTreeNodeMoreClick = (e:React.MouseEvent<HTMLSpanElement, MouseEvent>)=>{
    e.stopPropagation();
    return false;
}

/**更多按钮属性 */
export interface NodeButtonProps{

    /**显示的文本 */
    text:string;

    /**是否禁用 */
    disabled?:boolean;

    /**标题右边更多下拉菜单项点击 */
    onClick?:(node:BaseTreeNodeProps, e:React.MouseEvent<HTMLAnchorElement>)=>void;
}

/**新增属性 */
export interface TreeProps extends AntTreeProps{

    /**div样式类 */
    wrapClassName?:string;

    /**下拉菜单按钮 */
    nodeButtons?:NodeButtonProps[];
}

interface UserStateProps{

    /**是否显示指定id的popover */
    visiblePopoverNodeId?:string
}

/**
 * 树组件
 * 1. 修改了节点，节点选中样式
 * 2. 添加了右边更多选项以及菜单
 */
export const Tree = (props:TreeProps)=>{

    const [state, setState] = useState<UserStateProps>({visiblePopoverNodeId:undefined});

    const setPopopverVisible = (visible:boolean, nodeId:string)=>{
        setState({visiblePopoverNodeId:visible ? nodeId : undefined });
    }

    const className = props.className ?  getClass() +' '+props.className : getClass();

    const firstTreeItem = props.treeData?.[0] ? [props.treeData?.[0].key] : undefined;
    const switcherIcon = props.switcherIcon ? props.switcherIcon : <DownOutlined style={{ color: '#999', fontSize: 12 }}/>;

    /**渲染带更多按钮的标题 */
    const renderButtonTitle = (node:DataNode):React.ReactNode=>{
        const typeNode = node as BaseTreeNodeProps;
        const titleClassNames = classnames({
            [getClass('-title')]:true,
            'node-title-wrapper':true,
            [getClass('-leaf')]:node.isLeaf,
        });
        return <div className={titleClassNames}>
            <div className={`${getClass('-title-text')} tree-node-title-text`}>{typeNode.name}</div>
            <div className={'node-title-buttons-wrapper'}>
                <div className={'node-title-buttons'}>
                    <Popover
                        overlayClassName={getClass('-popover')}
                        placement="bottomLeft"
                        visible={state.visiblePopoverNodeId === typeNode.id}
                        onVisibleChange={(visible)=>setPopopverVisible(visible, typeNode.id)}
                        content={renderNodeButtons(typeNode, props.nodeButtons!)}
                        trigger="click"
                    >
                        <MoreOutlined className={getClass('-title-text-btns-btn')} onClick={onTreeNodeMoreClick}/>
                    </Popover>
                </div>
            </div>
        </div>;
    }

    /**
     * 渲染普通节点的标题
     * @param node
     */
    const renderTreeNodeTitle = (node:DataNode)=>{
        const typeNode = node;
        const titleClassNames = classnames({
            [getClass('-title')]:true,
            [getClass('-leaf')]:typeNode.isLeaf,
        });
        return <div className={titleClassNames}>
            <div className={`${getClass('-title-text')} tree-node-title-text`}>{typeNode.title}</div>
        </div>;
    }

    let titleRender:((node: DataNode) => React.ReactNode)|undefined = renderTreeNodeTitle;
    if(props.nodeButtons){
        titleRender = renderButtonTitle;
    }

    if(props.titleRender){
        titleRender = props.titleRender;
    }

    /**点击popover中的菜单按钮 */
    const onButtonClick = (button:NodeButtonProps, node:BaseTreeNodeProps, e:React.MouseEvent<HTMLAnchorElement>)=>{
        button.onClick?.(node, e);

        /**关闭popover */
        setState({visiblePopoverNodeId:undefined});
    }

    /**渲染标题中的按钮 */
    const renderNodeButtons = (node:BaseTreeNodeProps, nodeButtons:NodeButtonProps[])=>{
        return(
            <div className={getClass('-popover-buttons')}>
                {
                    nodeButtons.map((button, index)=>(
                        <Text key={index} onClick={(e:React.MouseEvent<HTMLAnchorElement>)=>onButtonClick(button, node, e)}>{button.text}</Text>
                    ))
                }
            </div>
        );
    }

    return (
        <div className={className}>
            {firstTreeItem && <AntTree
                {...props}
                motion={null}
                switcherIcon={switcherIcon}
                titleRender={titleRender}
                className={props.wrapClassName}
                defaultExpandedKeys={firstTreeItem}
            />}
        </div>
    )
}
