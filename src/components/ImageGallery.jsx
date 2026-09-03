import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function ImageGallery({ project, onClose }) {
  const allImages = [
    project.thumbnail_url,
    ...(project.images || []),
  ].filter(Boolean)

  const hasRealImages = allImages.length > 0
  const [currentIndex, setCurrentIndex] = useState(0)

  const goPrev = () => setCurrentIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))
  const goNext = () => setCurrentIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))

  return (
    <div className="gallery-modal" onClick={onClose}>
      <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="gallery-modal-header">
          <h3>{project.title}</h3>
          <button className="gallery-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {hasRealImages ? (
          <>
            <div className="gallery-main-image">
              <img src={allImages[currentIndex]} alt={`${project.title} ${currentIndex + 1}`} />
            </div>
            {allImages.length > 1 && (
              <>
                <div className="gallery-thumbnails">
                  {allImages.map((img, i) => (
                    <div
                      key={i}
                      className={`gallery-thumb ${i === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(i)}
                    >
                      <img src={img} alt={`thumbnail ${i + 1}`} />
                    </div>
                  ))}
                </div>
                <div className="gallery-nav">
                  <button className="gallery-nav-btn" onClick={goPrev}>
                    <ChevronLeft size={18} /> Prev
                  </button>
                  <button className="gallery-nav-btn" onClick={goNext}>
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="gallery-main-image">
            <span className="gallery-main-placeholder">📷</span>
          </div>
        )}
      </div>
    </div>
  )
}
