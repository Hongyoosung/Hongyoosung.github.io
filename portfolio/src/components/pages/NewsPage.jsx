import { useMemo, useState } from 'react'
import { ArrowLeft, CalendarDays, ExternalLink } from 'lucide-react'
import { getJournals, markdownToHtml } from '../../data/journals'

const pageSize = 10

const formatDate = (date, lang) => new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
}).format(new Date(date))

function JournalDetail({ lang, navigate, entry }) {
    if (!entry) {
        return (
            <main className="page-offset">
                <section className="section-padding" style={{ backgroundColor: 'var(--color-bg)' }}>
                    <div className="container-max">
                        <button className="back-button" onClick={() => navigate(lang === 'ko' ? '/ko/news' : '/news')}>
                            <ArrowLeft size={16} />
                            {lang === 'ko' ? '뉴스로 돌아가기' : 'Back to News'}
                        </button>
                        <h1 className="page-title">{lang === 'ko' ? '뉴스를 찾을 수 없습니다' : 'News Post Not Found'}</h1>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="page-offset">
            <article className="section-padding journal-detail-page">
                <div className="container-max">
                    <button className="back-button" onClick={() => navigate(lang === 'ko' ? '/ko/news' : '/news')}>
                        <ArrowLeft size={16} />
                        {lang === 'ko' ? '뉴스로 돌아가기' : 'Back to News'}
                    </button>

                    <p className="section-eyebrow">News</p>
                    <h1 className="page-title">{entry.title}</h1>
                    <div className="news-card-meta journal-detail-date">
                        <CalendarDays size={14} />
                        {formatDate(entry.date, lang)}
                    </div>
                    <div className="news-card-tags journal-detail-tags">
                        {entry.tags.map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>

                    <div
                        className="journal-detail-content"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(entry.content) }}
                    />
                </div>
            </article>
        </main>
    )
}

function NewsPage({ lang, navigate, selectedEntry }) {
    if (selectedEntry !== undefined) {
        return <JournalDetail lang={lang} navigate={navigate} entry={selectedEntry} />
    }

    const [page, setPage] = useState(1)
    const journals = getJournals(lang)
    const totalPages = Math.ceil(journals.length / pageSize)
    const currentPage = Math.min(page, totalPages || 1)
    const visibleJournals = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return journals.slice(start, start + pageSize)
    }, [currentPage, journals])

    const goToPage = (nextPage) => {
        setPage(nextPage)
        window.requestAnimationFrame(() => {
            document.querySelector('.news-page')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
    }

    return (
        <main className="page-offset">
            <section className="section-padding news-page" style={{ backgroundColor: 'var(--color-bg)' }}>
                <div className="container-max">
                    <button className="back-button" onClick={() => navigate(lang === 'ko' ? '/ko' : '/')}>
                        <ArrowLeft size={16} />
                        {lang === 'ko' ? '홈으로 돌아가기' : 'Back Home'}
                    </button>

                    <p className="section-eyebrow">News</p>
                    <h1 className="page-title">{lang === 'ko' ? 'AI 뉴스 저널' : 'AI News Journal'}</h1>
                    <p className="page-copy">
                        {lang === 'ko'
                            ? 'AI가 생성한 최신 AI, 게임 기술 관련 뉴스를 확인해보세요'
                            : 'Explore the latest AI-generated news on AI and game technology.'}
                    </p>

                    <div className="journal-list">
                        {visibleJournals.map((entry) => (
                            <a
                                key={entry.id}
                                className="journal-card"
                                href={entry.href}
                                onClick={(event) => {
                                    event.preventDefault()
                                    navigate(entry.href)
                                }}
                            >
                                <div className="journal-card-date">
                                    <CalendarDays size={14} />
                                    {formatDate(entry.date, lang)}
                                </div>
                                <div className="journal-card-body">
                                    <h2>{entry.title}</h2>
                                    <p>{entry.description}</p>
                                    <div className="journal-card-footer">
                                        <div className="news-card-tags">
                                            {entry.tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="tag">{tag}</span>
                                            ))}
                                        </div>
                                        <span className="mini-link">
                                            <ExternalLink size={13} />
                                            {lang === 'ko' ? '글 열기' : 'Open Post'}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <nav className="journal-pagination" aria-label={lang === 'ko' ? '뉴스 페이지' : 'News pages'}>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    className={pageNumber === currentPage ? 'active' : ''}
                                    onClick={() => goToPage(pageNumber)}
                                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                        </nav>
                    )}
                </div>
            </section>
        </main>
    )
}

export default NewsPage
