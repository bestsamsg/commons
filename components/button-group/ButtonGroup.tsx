/*
 * @Description: ButtonGroup
 * @Author: SZEWEC
 * @Date: 2021-09-14 11:15:12
 * @LastEditTime: 2022-06-14 11:01:26
 * @LastEditors: Sam
 */

import { Utils } from "../../utils/Utils";
import styles from './styles.less';
import React from "react";
import { Button, ButtonProps } from "antd";


/**按钮组参数属性 */
export interface ButtonGroupProps{

    /**按钮属性 */
    buttonList:ButtonProps[],

    /**样式类 */
    className?:string;
}

/**
 * 按钮分组组件
 */
export const ButtonGroup:React.FC<ButtonGroupProps> = (props:ButtonGroupProps)=>{
    const getClass = Utils.getStyles(styles, 'button-group');
    const { buttonList, className } = props;
    let classNames = getClass();
    if(className){
        classNames += ' '+className;
    }
    return(
        <div className={classNames}>
            {
                buttonList.map((button, index)=>{
                    return <Button key={index} {...button}>{button.name}</Button>
                })
            }
        </div>
    )
}
