import linkifyHtml from "linkify-html"

export const linkify = (text: string) => {
    const options = {
        className: 'link link-info',
        target: '_blank',
        nl2br: true
    }
    return linkifyHtml(text, options)
}