/*
 * @Description: react redux connect patch
 * @Author: Sam
 * @Date: 2021-08-17 15:54:34
 * @LastEditTime: 2021-09-14 14:54:22
 * @LastEditors: Sam
 */

import { connect as connectComponent } from 'umi';

/**链接修饰器 */
export const connect = (mapStateToProps?: any, actions?: any) => {
	return (target: any) => (
		connectComponent(mapStateToProps, actions)(target) as any
	);
};