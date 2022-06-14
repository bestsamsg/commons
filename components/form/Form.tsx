/*
 * @Description: Form
 * @Author: SZEWEC
 * @Date: 2021-09-15 10:35:43
 * @LastEditTime: 2022-06-14 11:01:48
 * @LastEditors: Sam
 */

import React, { Component, CSSProperties, ReactNode, ReactText } from "react";
import { Slider, Input, Checkbox, Select, Radio, Upload, DatePicker, Form as AntForm, Switch, ColProps, TreeSelectProps, TreeSelect, SelectProps, InputNumber, InputNumberProps, DatePickerProps, UploadProps, Button } from 'antd';
import { FormInstance, Rule } from "antd/lib/form";
import styles from './styles.less';
import { SliderSingleProps } from "antd/lib/slider";
import { InputProps } from "antd/lib/input";
import { RadioGroupProps } from "antd";
import { CheckboxGroupProps, CheckboxOptionType, CheckboxProps } from "antd/lib/checkbox";
import { RadioButtonProps } from "antd/lib/radio/radioButton";
import classnames from "classnames";
import { TextAreaProps } from "antd/lib/input";
import { SwitchProps } from "antd";
import { Utils } from "../../utils/Utils";
import { UploadOutlined } from '@ant-design/icons';
import { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';


const SelectOption = Select.Option;
const FormItem = AntForm.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const CheckboxGroup = Checkbox.Group;
const Textarea = Input.TextArea;
const { RangePicker } = DatePicker;

/**表单项类型 */
export type FieldType = string | 'uplod' | 'date' | 'date-range' | 'input-number' | 'file' | 'tree-select' | 'slot' | 'input' | 'textarea' | 'slider' | 'radio' | 'checkbox' | 'checkbox-group' | 'select' | 'password' | 'switch';

/**组件属性 */
export interface InputFieldProps {

    /**表单项类型 */
    type: FieldType;

    /**右边的按钮 */
    subfixIcon?:React.ReactNode,

    /**表单项字段名 */
    name: string;

    /**value处理 */
    getValueFromEvent?: (...args: any) => any;

    /**表单域前缀 */
    label: string;

    /**标签的宽度, 默认80px */
    labelWidth?: number;

    /**标签的百分比宽度 */
    labelWidthInPercent?: number;

    /**校验 */
    rules?: Rule[];

    /**只读 */
    readOnly?: boolean;

    /**禁用 */
    disabled?: boolean;

    /**占位 */
    placeholder?: string;

    /**是否有反馈 */
    hasFeedback?: boolean;

    /**表单修改回调 */
    onChange?: (value: string | number) => void;

    /**表单域对应的字段名 */
    valuePropName?: string;

    /**样式类 */
    className?: string;

    /**默认值, 显示placeholder需要设置为undefined */
    defaultValue?: string | number | string[];

    /**表单项的百分比宽度 */
    widthInPercent?: number;

    /**绝对值宽度, 优先级比widthInPercent高*/
    width?: number;

    /**是否隐藏 */
    hidden?: boolean;
}

/**上传组件 */
export type FormUploadProps = UploadProps & Partial<InputFieldProps> & {children:React.ElementType};

/**滑条slider属性 */
export type FormSliderProps = SliderSingleProps & Partial<Omit<InputFieldProps, 'value'>> & { type: 'slider' };

/**输入框input属性 */
export type FormInputProps = InputProps & Partial<InputFieldProps>;

/**数字输入框属性 */
export type FormInputNumberProps = InputNumberProps<string> & Partial<InputFieldProps>;

/**日期选择框， defaultValue:'2020-12-13' */
export type FormDateProps = DatePickerProps & Partial<Omit<InputFieldProps, 'defaultValue'>> & { defaultValue?: string, format?:string};

/**日期范围选择框，defaultValue:['2020-12-12'， '2020-12-13'] */
export type FormDateRangeProps = RangePickerProps & Partial<Omit<InputFieldProps, 'defaultValue'>> & { defaultValue?:[string, string], format?:string};

/**单选框组Radio属性 */
export interface FormRadioProps extends RadioGroupProps, Partial<Omit<InputFieldProps, 'defaultValue' | 'onChange'>> {

    /**选项组 */
    radios?: CheckboxOptionType[];

    /**按钮组，优先使用radios */
    buttons?: RadioButtonProps[];
}

/**标签与值 */
export interface LabelValue {
    label: string;
    value: string | number;
}

/**下拉框select组件 */
export interface FormSelectProps extends SelectProps<string>, Partial<Omit<InputFieldProps, 'defaultValue' | 'onChange' | 'placeholder'>> {
    /**选项 */
    options: LabelValue[];
}

/**多选框组checkbox-group属性 */
export interface FormCheckboxGroupProps extends Omit<CheckboxGroupProps, 'onChange'>, Partial<Omit<InputFieldProps, 'defaultValue' | 'onChange' | 'placeholder'>> {
    type: 'checkbox-group';
    onChange?: (values: any[]) => void;
}

/**多选框-单个 */
export interface FormCheckboxProps extends CheckboxProps, Partial<Omit<InputFieldProps, 'defaultValue' | 'onChange' | 'placeholder' | 'type'>> {
    type: 'checkbox';

    /**默认值 */
    defaultValue?: string;
}

/**文本框textarea属性 */
export interface FormTextareaProps extends TextAreaProps, Partial<Omit<InputFieldProps, 'onChange' | 'defaultValue'>> {

    /**默认值 */
    defaultValue?: string;
}

/**文本框switch属性 */
export interface FormSwitchProps extends SwitchProps, Partial<Omit<InputFieldProps, 'onChange' | 'defaultValue'>> {

    /**默认值 */
    defaultValue?: boolean;
}

/**自定义组件 */
export interface FormSlotProps extends Partial<InputFieldProps> {

    /**仅作类型兼容 */
    name?: string;

    /**子级 */
    children: TypeElement;
}

/**树形选择输入框tree-select */
export interface FormTreeSelectProps extends TreeSelectProps<string>, Omit<InputFieldProps, 'placeholder' | 'defaultValue' | 'onChange'> {
}

/**defaultValue必须在拥有name的情况下才会生效 */
type FormItemBaseProps = FormUploadProps | FormDateRangeProps | FormDateProps | FormInputNumberProps | FormTreeSelectProps | FormCheckboxProps | FormSlotProps | FormSwitchProps | FormTextareaProps | FormCheckboxGroupProps | FormSelectProps | FormSliderProps | FormInputProps | FormRadioProps;

/**表单项类型 */
export type FormItemProps = FormItemBaseProps;

/**表单属性 */
export interface FormProps {

    /**表单项列表 */
    fieldList: FormItemProps[];

    /**标签的宽度，优先级比Item的labelWidth低 */
    fieldLabelWidth?: number;

    /**表单域标签的百分比宽度，优先级比fieldLabelWidth低 */
    fieldLabelWidthInPercent?: number;

    /**表单域宽度 */
    fieldWidth?: number;

    /**表单项的百分比宽度，优先级比fieldWidth低 */
    fieldWidthInPercent?: number;

    /**样式类 */
    className?: string;

    /**自定义元素 */
    children?: TypeElement;

    /**底外边距 */
    marginBottom?: number;

    /**修改回调 */
    onChange?: (formItemProps: FormItemProps, ...restArgs: any[]) => void;
}

/**upload返回fieldList */
const normFile = (e: any) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

/**
 * 表单组件
 * ```
 *
 *  //整数
 *  isRequired && rules.push({required:true, message:`${item.name}必填`});
 *   if(length){
 *       const max = Math.pow(10, length) - 1;
 *       rules.push({type:'number', max, message:`${item.name}的值不能大于${max}`});
 *   }
 *   const placeholder = `请输入${item.name}`;
 *   const defaultValue = basic?.entityAttributes[item.code] || 0;
 *   const field:FormItemProps = {type:'input-number', label:item.name, name:item.code, rules, placeholder,  defaultValue};
 *   fieldList.push(field);
 *
 *
 *   //浮点
 *   if(length){
 *       const max = Math.pow(10, length) - 1;
 *       rules.push({type:'number', max, message:`${item.name}的值不能大于${max}`});
 *   }
 *
 *   const precision = item.precision ?? 2;
 *   let step = '1';
 *
 *   //从头开始添加，1, 01, 001, 0001
 *   for(let i=0; i< precision - 1; i++){
 *       step = '0' + step;
 *   }
 *
 *   //0.001
 *   step  = '0.' + step;
 *   const stepNumber = Number(step);
 *
 *
 *   const placeholder = `请输入${item.name}`;
 *   const defaultValue = basic?.entityAttributes[item.code] || 0;
 *   const field:FormItemProps = {type:'input-number', precision, step:stepNumber, label:item.name, name:item.code, rules, placeholder,  defaultValue};
 *   fieldList.push(field);
 *
 *
* 	fileList:=[
 * 		{type:'checkbox', label:'场景设置', name:'view', options:[{value:'globe', label:'地球'}, {value:'double-size', label:'双面渲染'}]},
 *  	{type:'slider', label:'对比度', defaultValue:20, name:'saturation', marks:{0:'0', 100:'100'}},
 * 		{type:'text', width:50, label:'姓名', name:'name',  placeholder:'名字' },
 *		{type:'textarea', label:'姓名', name:'textarea',  placeholder:'名字' },
 *		{type:'radio', label:'特殊设置', name:'effect', radios:[{label:'晴朗', value:'sunny'}, {label:'下雨', value:'rainy'}, {label:'下雪', value:'snowy'}]},
 *		{type:'select', label:'底图', autoFocus:true, name:'map', placeholder:'地图选择', options:[{label:'晴朗', value:'sunny'}, {label:'下雨', value:'rainy'}, {label:'下雪', value:'snowy'}]},
 *		{type:'switch', label:'开关', name:'switch', checkedChildren:'开', unCheckedChildren:'关' },
 *      {type:'tree-select', name:'group', treeData:groupTreeData, rules:[{required:true, message:"分组必填"}], label:'分组', placeholder:"请输入分组",  defaultValue:undefined},
 *      {type:'radio', label:'导入方式', name:'type', radios:[{label:'覆盖', value:'2'}, {label:'新增', value:'1'}], rules:[{required:true, message:'导入方式必选'}], defaultValue:'2'},
 *      {type:'date-range', name:'start-end', label:'上传日期', placeholder:['开始日期', '结束日期']},,
 *
 *	]
 * ```
 */
export class Form<P = any> extends Component<FormProps>{

    static defaultProps = {
        fieldWidthInPercent: 100
    }

    /**表单实列 */
    form!: FormInstance;

    getClass = Utils.getStyles(styles, 'form');

    /**
     * 设置表单域的值
     * @param keyValues
     */
    setFieldsValue(keyValues: Partial<P>) {
        this.form?.setFieldsValue(keyValues);
    }

    /**
     * 重置表单
     * @param names
     */
    resetFields(names?: string[]) {
        this.form?.resetFields(names);
    }

    /**
     * 获取指定名称表单域的值
     * @param name
     */
    getFieldValue(name: string) {
        return this.form?.getFieldValue(name);
    }

    /**
     * 获取所有单域的值
     */
    getFieldsValue() {
        return this.form?.getFieldsValue() as P;
    }

    /**
     * 获取表单项样式类，当label为''或者不设置时，返回`-item`
     * 当label设置为' '即空格，则会添加`-item-hidden-label`，这样可以保持label的宽度
     * @param label
     * @returns
     */
    getItemClassNames(label?: string, subfixIcon?:ReactNode) {
        if (!label) {
            return this.getClass('-item');
        }
        return classnames({
            [this.getClass('-item')]: true,
            [this.getClass('-item-hidden-label')]: !label.trim(),
            [this.getClass('-item-has-subfix-icon')]: !!subfixIcon
        });
    }


    /**
     * 全局修改回调
     * @param formItemProps
     * @returns
     */
    onChange(formItemProps: FormItemProps, ...restArgs: any[]) {
        if (!formItemProps.onChange) {
            return this.props.onChange?.(formItemProps, ...restArgs);
        }
    }

    /**
     * 获取列宽度
     * @param field
     * @returns
     */
    getColWidthStyle(field: FormItemProps) {
        const labelWidthInPercent = field.labelWidthInPercent || this.props.fieldLabelWidthInPercent;
        const labelWidth = field.labelWidth || this.props.fieldLabelWidth;
        const result: { labelColProps?: ColProps; wrapperColProps?: ColProps; } = {
            labelColProps: undefined,
            wrapperColProps: undefined,
        }

        /**label宽度与wrapper宽度匹配 */
        if (labelWidthInPercent) {
            result.labelColProps = { style: { width: labelWidthInPercent + '%' } };
            result.wrapperColProps = { style: { width: `calc(100% - ${labelWidthInPercent}%` } };
        }
        if (labelWidth) {
            result.labelColProps = { style: { width: labelWidth + 'px' } };
            result.wrapperColProps = { style: { width: `calc(100% - ${labelWidth}px` } };
        }
        return result;
    }

    /**获取校验后的值 */
    async getKeyValues() {
        const kvs = await this.form.validateFields();
        for (const k in kvs) {
            if (typeof kvs[k] === 'undefined') {
                kvs[k] = null;
            }

            /**日期处理 */
            if(moment.isMoment(kvs[k])){
                const field = this.props.fieldList.find(item=>item.name === k) as FormDateProps;

                /**日期/日期时间 */
                if(field.type === 'date'){
                    const date = kvs[k] as moment.Moment;
                    const format = field.format || 'YYYY-DD-MM';
                    kvs[k] = date.format(format);
                }

                /**日期范围 */
                if(field.type === 'date-range'){
                    const dates = kvs[k] as [moment.Moment|undefined, moment.Moment|undefined];
                    const format = field.format || 'YYYY-DD-MM';
                    kvs[k] = [dates[0]?.format(format), dates[1]?.format(format)];
                }
            }
        }
        return kvs as P;
    }

    /**
     * 渲染字段输入项
     * @param field
     */
    renderField(field: FormItemProps) {

        delete field.defaultValue;
        delete field.labelWidth;
        delete field.labelWidthInPercent;
        delete field.width;
        delete field.widthInPercent;
        delete field.subfixIcon;

        /**number输入框 */
        if (field.type === 'input-number') {

            //@ts-ignore
            field = field as FormInputNumberProps;

            //@ts-ignore
            return <InputNumber onChange={ this.onChange.bind(this, field) } { ...field } />
        }

        /**text输入框 */
        if (field.type === 'input') {
            field = field as FormInputProps;
            return <Input onChange={ this.onChange.bind(this, field) } { ...field } />
        }

        /**file输入框 */
        if (field.type === 'file') {
            field = field as FormInputProps;
            return <Input type="file" onChange={ this.onChange.bind(this, field) } { ...field } />
        }

        /**upload */
        if (field.type === 'upload') {
            field = field as FormUploadProps;
            return <Upload onChange={ this.onChange.bind(this, field) } beforeUpload={()=>false} { ...field } >
                {field.children ? field.children : <Button icon={<UploadOutlined />}>{'上传'}</Button>}
            </Upload>
        }

        /**slider */
        if (field.type === 'slider') {
            return <Slider onChange={this.onChange.bind(this, field)} {...field as FormSliderProps} />
        }

        /**radio */
        if (field.type === 'radio') {
            field = field as FormRadioProps;
            const radios = field.radios?.map(option => (
                <Radio key={option.value as string} value={option.value}>{option.label}</Radio>
            ));
            const buttons = field.buttons?.map(button => (
                <RadioButton key={ button.value as string } { ...button } value={ button.value }>{ button.name }</RadioButton>
            ))
            return <RadioGroup onChange={ this.onChange.bind(this, field) } { ...field } >
                { radios ? radios : buttons }
            </RadioGroup>
        }

        /**select */
        if (field.type === 'select') {
            field = field as FormSelectProps;
            return <Select onChange={ this.onChange.bind(this, field) } { ...field }>

            </Select>
        }

        /**tree-select */
        if (field.type === 'tree-select') {
            field = field as FormTreeSelectProps;
            return <TreeSelect onChange={ this.onChange.bind(this, field) } { ...field } />
        }

        /**checkbox-group */
        if (field.type === 'checkbox-group') {
            field = field as FormCheckboxGroupProps;

            //@ts-ignore
            return <CheckboxGroup onChange={ this.onChange.bind(this, field) } { ...field } />
        }

        /**checkbox */
        if (field.type === 'checkbox') {
            field = field as FormCheckboxProps;
            return <Checkbox onChange={ this.onChange.bind(this, field) } { ...field } />
        }

        /**textarea */
        if (field.type === 'textarea') {
            field = field as FormTextareaProps;
            return <Textarea onChange={ this.onChange.bind(this, field) } { ...field } />
        }

        /**switch */
        if (field.type === 'switch') {
            field = field as FormSwitchProps;
            return <Switch onChange={ this.onChange.bind(this, field) } { ...field } />
        }

        /**date */
        if (field.type === 'date') {
            field = field as FormDateProps;
            return <DatePicker onChange={ this.onChange.bind(this, field) } { ...field } />
        }

        /**date */
        if (field.type === 'date-range') {
            field = field as FormDateRangeProps;
            return <RangePicker onChange={ this.onChange.bind(this, field) } { ...field }/>
        }
    }

    render() {
        const { fieldList, className, marginBottom } = this.props;
        const formClassObj: KVObject = {
            [this.getClass()]: true
        }
        if (typeof className === 'string') {
            formClassObj[className] = true;
        }
        const formClassNames = classnames(formClassObj);
        return (
            <AntForm<P> ref={ ref => this.form = ref! } className={ formClassNames }>
                {
                    fieldList.map((field, index) => {

                        //@ts-ignore
                        const isRequired = field.rules?.some(item=>item.required === true);
                        const widthInPercent = field.widthInPercent || this.props.fieldWidthInPercent;
                        const width = field.width || this.props.fieldWidth;
                        const style: CSSProperties = {};
                        if (widthInPercent) {
                            style.width = widthInPercent + '%';
                        }
                        if (width) {
                            style.width = width + 'px';
                        }

                        //@todo switch
                        let valuePropName: string | undefined = field.valuePropName;

                        if (field.hidden) {
                            style.display = 'none';
                        }
                        if (marginBottom) {
                            style.marginBottom = marginBottom;
                        }

                        /**自定义组件 */
                        if (field.type === 'slot') {
                            let classNames = classnames({
                                [this.getClass('-slot')]: true,
                            });
                            if (typeof field.className === 'string') {
                                classNames += ' ' + field.className;
                            }
                            return <div key={ index } className={ classNames } style={ style }>
                                { (field as FormSlotProps).children }
                            </div>
                        }

                        const colStyle = this.getColWidthStyle(field);

                        if (field.type === 'upload') {
                            field.getValueFromEvent = field.getValueFromEvent || normFile;
                        }


                        let defaultValue = field.defaultValue;

                        /**日期默认值处理 */
                        if(field.type === 'date-range'){
                            field = field as FormDateRangeProps;
                            const begin = field.defaultValue?.[0] ? moment(field.defaultValue?.[0], field.format  || 'YYYY-DD-MM') : undefined;
                            const end = field.defaultValue?.[1] ? moment(field.defaultValue?.[1], field.format || 'YYYY-DD-MM') : undefined;

                            /**日期字符串转时间 */
                            let defaultValue:any = begin || end ? [] : undefined;
                            if(begin) defaultValue[0] = begin;
                            if(end) defaultValue[1] = end;
                            defaultValue = [begin, end];
                        }

                        if(field.type === 'date'){
                            field = field as FormDateProps;

                            /**日期字符串转时间 */
                            defaultValue = field.defaultValue ? moment(field.defaultValue, field.format || 'YYYY-DD-MM') : undefined;
                        }

                        const subfixIcon = field.subfixIcon;
                        const labelClassName = classnames({
                            [this.getClass('-item-label')]:true,
                            [this.getClass('-item-label-required')]:isRequired,
                        })

                        const label = <span className={labelClassName} title={field.label}>{field.label}</span>

                        /**自定义label的宽度 */
                        return <div key={ index } className={ this.getItemClassNames(field.label, subfixIcon) } style={ style }>
                            <FormItem
                                initialValue={ defaultValue }
                                name={ field.name }
                                valuePropName={ valuePropName }
                                rules={ field.rules }
                                className={field.className}
                                getValueFromEvent={ field.getValueFromEvent }
                                labelCol={ colStyle.labelColProps }
                                wrapperCol={ colStyle.wrapperColProps }
                                label={ label }
                            >
                                { this.renderField(field) }
                            </FormItem>
                            {subfixIcon ? <div className={this.getClass('-item-subfix-icon')}>{subfixIcon}</div> : null}
                        </div>
                    })
                }
                {this.props.children }
            </AntForm>
        )
    }
}
