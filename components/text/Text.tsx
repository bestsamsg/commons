/*
 * @Description:Text
 * @Author: SZEWEC
 * @Date: 2021-10-20 15:16:44
 * @LastEditTime: 2022-06-14 11:02:18
 * @LastEditors: Sam
 */

import React, { FC } from 'react';
import classnames from 'classnames';
import styles from './styles.less';
import { Utils } from '../../utils/Utils';

/**文本组件属性 */
export interface TextProps{

    /**内容 */
    children?:TypeElement;

    /**是否禁用 */
    disabled?:boolean;

    /**点击 */
    onClick?:(...arg:any[])=>void;

    /**样式类 */
    className?:string;
}

const getClass = Utils.getStyles(styles, 'text');

/**文本组件 */
export const Text:FC<TextProps> = (props)=>{
    const { children, disabled, onClick, className} = props;
    let classNames  = classnames({
        [getClass()]:true,
    });
    if(className){
        classNames += ' '+className;
    }
    if(disabled){
        classNames += ' '+getClass('-disabled');
    }
    return <a className={classNames} onClick={disabled ? undefined : onClick}>{children}</a>;
}
