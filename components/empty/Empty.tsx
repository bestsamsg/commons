/*
 * @Description:Empty
 * @Author: SZEWEC
 * @Date: 2021-12-17 15:09:33
 * @LastEditTime: 2021-12-17 15:21:49
 * @LastEditors: Sam
 */
import React from 'react';
import { Empty as AEmpty, EmptyProps as AEmptyProp } from 'antd';
import styles from './styles.less';
import classnames from 'classnames';

export interface EmptyProps extends AEmptyProp{}


/**
 * 水平垂直居中的空数据提示
 * 水平垂直居中相对于拥有position:relative的父级
 */
export const Empty:React.FC<EmptyProps> = (props:EmptyProps)=>{
    let className = classnames({
        [styles.empty]:true
    });
    if(props.className){
        className += ' ' + props.className;
    }
    return <AEmpty {...props} className={className}/>
}
