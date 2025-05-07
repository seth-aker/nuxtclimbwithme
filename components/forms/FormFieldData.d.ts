import type { SubmissionHandler } from "vee-validate";
import type { Component } from "vue";
import type { z } from "zod";

export interface FormFieldData {
    name: string,
    label: string,
    initialValue?: any,
    zodSchema: z.Schema,
    placeholder?: any,
    component: string | Component,
    componentProps?: {
        selectOptions?: {value: string, label: string, disabled?: boolean }[], // for select input
        type?: string,     // inputType
        maxlength?: string // for textarea
        [key: string]: any
    }
 }

export interface FormTemplateProps {
    fields: FormFieldData[],
    submitFactory: (handleSubmit: THandleSubmit) => (e?: Event) => Promise<Promise<void> | undefined>,
    loading: boolean
}

type HandleSubmitFactory<TValues extends GenericObject, TOutput extends GenericObject = TValues> = <TReturn = unknown>(cb: SubmissionHandler<TValues, TOutput, TReturn>, onSubmitValidationErrorCb?: InvalidSubmissionHandler<TValues, TOutput>) => (e?: Event) => Promise<TReturn | undefined>;
type THandleSubmit = HandleSubmitFactory<TValues, TOutput> & {
    withControlled: HandleSubmitFactory<TValues, TOutput>;
}