/*
 * @Description: BreadcrumbNavigation
 * @Author: Sam
 * @Date: 2022-06-14 10:38:17
 * @LastEditTime: 2022-06-14 11:05:23
 * @LastEditors: Sam
 */
import React from 'react';
import { Breadcrumb } from 'antd';
import './styles.less';
import { history } from 'umi';
import { LeftOutlined } from '@ant-design/icons';


/**路由信息 */
export interface RouteProps{
    path?:string;
    name:string;
}

export interface BreadcrumbNavigationProps{
    routes:RouteProps[];
    theme?:string;
    fontStyle?:React.CSSProperties;
}

/**页面面包屑 */
export const BreadcrumbNavigation = (props:BreadcrumbNavigationProps) => {
    const { routes, theme, fontStyle } = props;

    /**路径跳转 */
    const locateRoute = (route:RouteProps)=>{
        !!route.path && history.push(route.path);
    }
    const items = routes.map((route, i) => {
        const className = route.path ? 'text-header-breadcrumb-with-link' : 'text-header-breadcrumb';
        return <Breadcrumb.Item key={`${i}-${route}`} onClick={()=>locateRoute(route)}>
            <span style={fontStyle} className={className}>{route.name}</span>
        </Breadcrumb.Item>
    });
    return(
        <div className="breadcrumb-navigation">
            <LeftOutlined className="breadcrumb-navigation-left-icon"/>
            <Breadcrumb className={`${theme ? theme : ''}`}>{items}</Breadcrumb>
        </div>
    )
}

