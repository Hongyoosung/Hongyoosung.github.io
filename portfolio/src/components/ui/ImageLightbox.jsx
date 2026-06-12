import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const closeDelayMs = 260

function ImageLightbox({ image, onClose, label = 'Expanded image' }) {
    const [closing, setClosing] = useState(false)

    useEffect(() => {
        if (!image?.src) return undefined

        const onKeyDown = (event) => {
            if (event.key === 'Escape') requestClose()
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [image?.src])

    useEffect(() => {
        setClosing(false)
    }, [image?.src])

    const requestClose = () => {
        if (closing) return
        setClosing(true)
        window.setTimeout(onClose, closeDelayMs)
    }

    if (!image?.src) return null

    return (
        <div
            className={`image-lightbox${closing ? ' is-closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={image.alt || label}
            onClick={requestClose}
        >
            <button
                type="button"
                className="image-lightbox-close"
                onClick={requestClose}
                aria-label="Close image"
            >
                <X size={18} />
            </button>
            <div className="image-lightbox-scroller">
                {image.src.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                        className="image-lightbox-pdf"
                        src={image.src}
                        title={image.alt || label}
                        onClick={(event) => event.stopPropagation()}
                    />
                ) : (
                    <img
                        className="image-lightbox-img"
                        src={image.src}
                        alt={image.alt || label}
                        onClick={(event) => event.stopPropagation()}
                    />
                )}
            </div>
        </div>
    )
}

export default ImageLightbox
