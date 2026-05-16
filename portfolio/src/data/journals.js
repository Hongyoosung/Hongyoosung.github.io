const journalModules = import.meta.glob('../../../content/journal/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
})

const stripQuotes = (value = '') => value.trim().replace(/^["']|["']$/g, '')

const parseArray = (value = '') => {
    const trimmed = value.trim()
    if (!trimmed.startsWith('[')) return []

    try {
        return JSON.parse(trimmed.replace(/'/g, '"'))
    } catch {
        return trimmed
            .replace(/^\[|\]$/g, '')
            .split(',')
            .map((item) => stripQuotes(item))
            .filter(Boolean)
    }
}

const normalizeJournalRaw = (raw) => raw
        .trim()
        .replace(/^```[a-zA-Z]*\s*/, '')
        .replace(/\s*```$/, '')
        .trim()

const parseFrontMatter = (raw) => {
    const normalized = normalizeJournalRaw(raw)
    const match = normalized.match(/^---\s*\n([\s\S]*?)\n---/)

    if (!match) return {}

    return match[1].split('\n').reduce((meta, line) => {
        const separatorIndex = line.indexOf(':')
        if (separatorIndex === -1) return meta

        const key = line.slice(0, separatorIndex).trim()
        const value = line.slice(separatorIndex + 1).trim()
        meta[key] = value.startsWith('[') ? parseArray(value) : stripQuotes(value)
        return meta
    }, {})
}

const getBody = (raw) => normalizeJournalRaw(raw).replace(/^---\s*\n[\s\S]*?\n---/, '').trim()

const escapeHtml = (value = '') => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const inlineMarkdown = (value = '') => escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')

export const markdownToHtml = (markdown = '') => {
    const lines = markdown.split(/\r?\n/)
    const html = []
    let paragraph = []

    const flushParagraph = () => {
        if (!paragraph.length) return
        html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`)
        paragraph = []
    }

    for (const line of lines) {
        const trimmed = line.trim()

        if (!trimmed) {
            flushParagraph()
            continue
        }

        const heading = trimmed.match(/^(#{2,4})\s+(.+)$/)
        if (heading) {
            flushParagraph()
            const level = Math.min(heading[1].length + 1, 5)
            html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`)
            continue
        }

        paragraph.push(trimmed)
    }

    flushParagraph()
    return html.join('\n')
}

const getEntryMeta = (path, raw) => {
    const fileName = path.split('/').pop()
    const lang = fileName.endsWith('.ko.md') ? 'ko' : 'en'
    const slug = fileName.replace(/\.ko\.md$|\.md$/g, '')
    const meta = parseFrontMatter(raw)

    return {
        id: `${slug}-${lang}`,
        slug,
        lang,
        title: meta.title || slug,
        date: meta.date || '',
        description: meta.description || '',
        tags: meta.tags || [],
        content: getBody(raw),
        href: lang === 'ko' ? `/ko/news/${slug}` : `/news/${slug}`,
    }
}

const allJournals = Object.entries(journalModules)
    .map(([path, raw]) => getEntryMeta(path, raw))
    .filter((entry) => entry.title && entry.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))

export const journalsByLang = {
    en: allJournals.filter((entry) => entry.lang === 'en'),
    ko: allJournals.filter((entry) => entry.lang === 'ko'),
}

export const getJournals = (lang = 'en') => {
    const preferred = journalsByLang[lang] || []
    return preferred.length ? preferred : journalsByLang.en
}

export const getLatestJournals = (lang = 'en', count = 3) => getJournals(lang).slice(0, count)

export const getJournalBySlug = (lang = 'en', slug) => {
    const preferred = getJournals(lang).find((entry) => entry.slug === slug)
    return preferred || journalsByLang.en.find((entry) => entry.slug === slug)
}
