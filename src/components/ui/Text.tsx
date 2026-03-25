interface TextInterface {
    styleType: "default" | "title" | "subtitle" | "sm-muted",
    value: string
}

export default function Text({styleType, value}: TextInterface) {
    const textstyle = { 
        "title": "text-lg font-semibold text-slate-900",
        "subtitle": "text-sm text-slate-500 line-clamp-2",
        "default": "text-md font-semibold text-slate-900 line-clamp-2",
        "sm": "text-md font-semibold text-slate-900 line-clamp-2",
        "sm-muted": "text-sm text-slate-500 line-clamp-2"
    }
    return <p className={textstyle[styleType] || textstyle['default']}>{value}</p>
}
