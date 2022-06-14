/*
 * @Description: SearchForm
 * @Author: SZEWEC
 * @Date: 2021-09-13 17:17:09
 * @LastEditTime: 2022-06-14 11:02:10
 * @LastEditors: Sam
 */
import React  from 'react';
import { Utils } from '../../utils/Utils';
import styles from './styles.less';
import { Button } from 'antd';
import classnames from 'classnames';
import { FormInstance } from 'antd/lib/form';
import { Form, FormItemProps, FormProps } from '../form';

/**搜索表单属性 */
export interface SearchFormProps<P> extends Omit<FormProps, 'ref'>{

    /**搜索 */
    onSubmit?:(keyValues:P)=>void;

    /**重置 */
    onReset?:()=>void;

    /**是否添加边框 */
    bordered?:boolean;
}

/**
 * 搜索表单
 *
 * ```
 * const searchFormProps:SearchFormProps = {
 *      fieldLabelWidth:50,
 *      fieldWidth:250,
 *      fieldList:[
 *          {type:'input', name:'name', labelWidth:80, width:300, onChange:this.onInputChange.bind(this), label:'名称', placeholder:'请输入名称'},
 *          {type:'select', name:'status', label:'状态', options:[{label:'停止', value:'STOP'}, {label:'运行', value:'RUNNING'}], placeholder:'请输入名称'},
 *      ],
 *      onChange:this.onSearchFormChange.bind(this)
 * }
 * ```
 */
export class SearchForm<P> extends React.Component<SearchFormProps<P>>{

    static defaultProps = {
        fieldLabelWidth:60,
        fieldWidth:180,
    }
    getClass = Utils.getStyles(styles, 'search-form');
    form!:FormInstance;

    /**搜索 */
    onSearch(){
        const kvs = this.form.getFieldsValue();
        this.props.onSubmit?.(kvs as P);
    }

    /**重置 */
    onReset(){
        this.form.resetFields();
        this.props.onReset?.();
    }
    render(){
        const { bordered, className } = this.props;
        const formClassObj:KVObject = {
            [this.getClass()]:true
        }
        if(typeof className === 'string'){
            formClassObj[className] = true;
        }
        if(bordered){
            formClassObj[this.getClass('-bordered')] = true;
        }
        const classNames = classnames(formClassObj);
        return(
            <Form<P> ref={ref=>this.form = ref?.form!} {...this.props} className={classNames}>
                <div className={this.getClass('-buttons')}>
                    <Button type="primary" ghost onClick={this.onSearch.bind(this)}>搜索</Button>
                    <Button onClick={this.onReset.bind(this)}>重置</Button>
                </div>
			</Form>
        )
    }
}
