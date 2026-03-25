import { ReactElement } from "react";

export default function Label(
    { value, styleType }:
        { value: ReactElement, styleType: "default" }

) {
    const labelType = {
        'default': "flex flex-col gap-1 text-sm text-slate-700"
    }
    return value
        ? <label className={labelType[styleType] || labelType['default']}>{value}</label>
        : null
}