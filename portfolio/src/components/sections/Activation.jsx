import { credentials } from '../../data/skills'
import { useState } from 'react'
import { useInView } from '../../hooks/useInView'
import ImageLightbox from '../ui/ImageLightbox'

function Activation({ lang }) {
    const [ref, visible] = useInView()
    const [lightboxImage, setLightboxImage] = useState(null)
    const fx = (delay = 0) => visible
        ? { animation: `fadeInUp 0.5s ease ${delay}ms both` }
        : { opacity: 0 }

    return (
        <section
            ref={ref}
            id="activation"
            aria-label={lang === 'ko' ? '활동' : 'Activation'}
            className="section-padding section-tone-black"
        >
            <div className="container-max">
                <p className="section-eyebrow" style={fx(0)}>Activation</p>
                <h2 className="section-title" style={fx(60)}>
                    {lang === 'ko' ? '활동' : 'Activation'}
                </h2>

                <div className="credentials-list" aria-label={lang === 'ko' ? '수상, 자격증, 활동 내역' : 'Awards, certifications, and activities'}>
                    {credentials.map(({ title, items }, i) => (
                        <section key={title.en} className="credential-section" style={fx(120 + i * 80)}>
                            <p className="skills-category">{title[lang]}</p>
                            <div className="credential-items">
                                {items.map(({ name, date, details, proofImage }) => (
                                    <article key={`${title.en}-${name.en}`} className="credential-item">
                                        <div className="credential-heading">
                                            {proofImage ? (
                                                <button
                                                    type="button"
                                                    className="credential-title-button"
                                                    onClick={() => setLightboxImage({ src: proofImage, alt: name[lang] })}
                                                >
                                                    {name[lang]}
                                                </button>
                                            ) : (
                                                <h3>{name[lang]}</h3>
                                            )}
                                            {date && <span className="date-text">{date}</span>}
                                        </div>
                                        <ul className="clean-list">
                                            {details[lang].map((detail) => (
                                                <li key={detail}>{detail}</li>
                                            ))}
                                        </ul>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
            <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
        </section>
    )
}

export default Activation
