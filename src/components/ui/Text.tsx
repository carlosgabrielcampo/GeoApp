import { TextInterface } from "@/types/ui"

export default function Text({styleType, value}: TextInterface) {
    const textstyle = { 
        "default": "text-md font-semibold text-slate-900 line-clamp-2",
        "sm": "text-md font-semibold text-slate-900 line-clamp-2",
        "sm-muted": "text-sm text-slate-500 line-clamp-2",
        "title": "text-lg font-semibold text-slate-900",
    }
    return <p className={textstyle[styleType] || textstyle['default']}>{value}</p>
}
