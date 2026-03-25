interface TextInterface {
    styleType: "default" | "title" | "subtitle",
    value: string
}

export default function Text({styleType, value}: TextInterface) {
    const textstyle = { 
        "title": "text-lg font-semibold text-slate-900",
        "subtitle": "text-sm text-slate-500",
        "default": "text-md font-semibold text-slate-900" 
    }
    return <p className={textstyle[styleType] || textstyle['default']}>{value}</p>
}
