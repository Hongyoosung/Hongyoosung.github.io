import { ArrowRight, CalendarDays } from 'lucide-react'
import { getLatestJournals } from '../../data/journals'
import { useInView } from '../../hooks/useInView'

const formatDate = (date, lang) => new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
}).format(new Date(date))

function News({ lang, navigate }) {
    const [ref, visible] = useInView()
    const latest = getLatestJournals(lang, 3)
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    return (
        <section ref={ref} id="news" aria-label="News" className="section-padding news-section">
            <div className="container-max">
                <div className="news-section-header">
                    <div>
                        <p className="section-eyebrow" style={fx(0)}>News</p>
                        <h2 className="section-title" style={fx(60)}>
                            {lang === 'ko' ? 'AI 뉴스 저널' : 'AI News Journal'}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="pill-link news-all-link"
                        onClick={() => navigate(lang === 'ko' ? '/ko/news' : '/news')}
                        style={fx(90)}
                    >
                        {lang === 'ko' ? '뉴스 전체보기' : 'View All News'}
                        <ArrowRight size={15} />
                    </button>
                </div>

                <div className="news-preview-grid" style={fx(120)}>
                    {latest.map((entry) => (
                        <a
                            key={entry.id}
                            className="news-card"
                            href={entry.href}
                            onClick={(event) => {
                                event.preventDefault()
                                navigate(entry.href)
                            }}
                        >
                            <div className="news-card-meta">
                                <CalendarDays size={14} />
                                {formatDate(entry.date, lang)}
                            </div>
                            <h3>{entry.title}</h3>
                            <p>{entry.description}</p>
                            <div className="news-card-tags">
                                {entry.tags.slice(0, 3).map((tag) => (
                                    <span key={tag} className="tag">{tag}</span>
                                ))}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default News
