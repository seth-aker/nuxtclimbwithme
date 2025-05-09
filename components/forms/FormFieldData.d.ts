import { FormField } from "../ui/form";
import type { ComponentProps } from "vue-component-type-helpers";
import type { BaseComponentBinds, SubmissionHandler } from "vee-validate";
import type { Component } from "vue";
import type { z } from "zod";

export interface FormFieldData {
    name: string,
    label: string,
    zodSchema: z.Schema,
    component: string | Component,
    description?: string,
    placeholder?: any,
    formFieldProps?: {[key: string]: any},
    formItemProps?: {[key: string]: any},
    formLabelProps?: {[key: string]: any}
    componentProps?: {
        selectOptions?: {value: string, label: string, disabled?: boolean }[], // for select input
        type?: HTMLInputElement['type'],     // inputType
        maxlength?: HTMLInputElement['maxLength'] // for textarea
        [key: string]: any
    },
    formMessageProps?: {[key: string]: any}
 }

export interface FormTemplateProps {
    fields: FormFieldData[],
    submitFactory: (handleSubmit: THandleSubmit) => (e?: Event) => Promise<Promise<void> | undefined>,
    loading: boolean,
    initialValues?: Record<string, any>
}

type HandleSubmitFactory<TValues extends GenericObject, TOutput extends GenericObject = TValues> = <TReturn = unknown>(cb: SubmissionHandler<TValues, TOutput, TReturn>, onSubmitValidationErrorCb?: InvalidSubmissionHandler<TValues, TOutput>) => (e?: Event) => Promise<TReturn | undefined>;
type THandleSubmit = HandleSubmitFactory<TValues, TOutput> & {
    withControlled: HandleSubmitFactory<TValues, TOutput>;
}