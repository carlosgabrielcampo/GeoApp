import { ChangeEventHandler } from "react"

interface textAreaInterface {
    value: string
    styleType: 'default',
    onchange: ChangeEventHandler<HTMLTextAreaElement, HTMLTextAreaElement>,
    placeholder: string
}

export default function TextArea({
    value,
    styleType,
    onchange,
    placeholder
}: textAreaInterface ) {

    const textAreaType = {
        'default': "min-h-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500"
    }
    return ( 
        <textarea 
            value={ value } 
            onChange={ onchange } 
            className={ textAreaType[styleType] || textAreaType['default'] } 
            placeholder = { placeholder } 
        /> 
    )
}