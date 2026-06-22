import { useEffect } from 'react'
import { X, Github, ExternalLink, Calendar, User, Users, Wrench, Star, Lock, Youtube } from 'lucide-react'

function ProjectModal({ project, onClose }) {
  // ESC 키로 닫기
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    // 스크롤 잠금
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!project) return null

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'fadeIn 150ms ease',
        }}
        aria-hidden="true"
      />

      {/* 모달 패널 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        style={{
          position: 'fixed', inset: 0, zIndex: 101,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
            width: '100%', maxWidth: '580px',
            maxHeight: '85vh',
            overflowY: 'auto',
            boxShadow: 'rgba(0,0,0,0.2) 0px 0px 0px 1px, rgba(0,0,0,0.15) 0px 20px 60px',
            pointerEvents: 'auto',
            animation: 'slideUp 200ms ease',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* 프로젝트 이미지 */}
          {project.image && (
            <div
              style={{
                width: '100%', aspectRatio: '16 / 9',
                overflow: 'hidden',
                borderRadius: '20px 20px 0 0',
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {/* 모달 헤더 */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: '16px',
            padding: '28px 28px 24px',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '24px', fontWeight: 300,
                lineHeight: 1.2, color: 'var(--color-fg)',
                margin: '0 0 8px 0',
              }}>
                {project.title}
              </h2>

              {/* 태그 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.tags.map((tag) => (
                  <span key={tag} style={{
                    fontFamily: 'var(--font-body)', fontSize: '12px',
                    fontWeight: 500, color: 'var(--color-fg-muted)',
                    backgroundColor: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '4px', padding: '2px 8px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              aria-label="모달 닫기"
              style={{
                background: 'none', cursor: 'pointer',
                border: '1px solid var(--color-border)',
                borderRadius: '8px', padding: '6px',
                color: 'var(--color-fg-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'color var(--transition), border-color var(--transition)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--color-fg)'
                e.currentTarget.style.borderColor = 'var(--color-fg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--color-fg-muted)'
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* 모달 본문 */}
          <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* 소개 */}
            <div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '15px',
                fontWeight: 400, lineHeight: 1.75, letterSpacing: '0.15px',
                color: 'var(--color-fg-secondary)', margin: 0,
              }}>
                {project.detail?.summary || project.description}
              </p>
            </div>

            {/* 메타 정보 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
            }}>
              {[
                { icon: <Calendar size={14} />, label: '기간', value: project.detail?.period },
                { icon: <Users size={14} />, label: '팀 구성', value: project.detail?.team },
                { icon: <User size={14} />, label: '역할', value: project.detail?.role },
              ].filter(item => item.value).map(({ icon, label, value }) => (
                <div key={label} style={{
                  backgroundColor: 'var(--color-bg-alt)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px', padding: '14px 16px',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    color: 'var(--color-fg-muted)',
                    fontFamily: 'var(--font-body)', fontSize: '12px',
                    fontWeight: 500, marginBottom: '6px',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {icon}
                    {label}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px',
                    fontWeight: 400, color: 'var(--color-fg)',
                    margin: 0, lineHeight: 1.5,
                  }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* 주요 기능 */}
            {project.detail?.features?.length > 0 && (
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  fontWeight: 600, color: 'var(--color-fg-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '12px',
                }}>
                  <Wrench size={13} />
                  주요 기능
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {project.detail.features.map((feature, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      fontFamily: 'var(--font-body)', fontSize: '14px',
                      fontWeight: 400, lineHeight: 1.6,
                      color: 'var(--color-fg-secondary)',
                    }}>
                      <span style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        backgroundColor: 'var(--color-fg-muted)',
                        flexShrink: 0, marginTop: '7px',
                      }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 개인 기여 */}
            {project.detail?.contributions?.length > 0 && (
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontFamily: 'var(--font-body)', fontSize: '13px',
                  fontWeight: 600, color: 'var(--color-fg-muted)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginBottom: '12px',
                }}>
                  <Star size={13} />
                  개인 기여
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {project.detail.contributions.map((item, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '10px',
                      fontFamily: 'var(--font-body)', fontSize: '14px',
                      fontWeight: 400, lineHeight: 1.6,
                      color: 'var(--color-fg-secondary)',
                    }}>
                      <span style={{
                        width: '5px', height: '5px', borderRadius: '50%',
                        backgroundColor: 'var(--color-fg-muted)',
                        flexShrink: 0, marginTop: '7px',
                      }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 트러블슈팅 */}
            {project.detail?.trouble && (() => {
              const troubles = Array.isArray(project.detail.trouble)
                ? project.detail.trouble
                : [project.detail.trouble]
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    fontFamily: 'var(--font-body)', fontSize: '13px',
                    fontWeight: 600, color: 'var(--color-fg-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    트러블슈팅
                  </div>
                  {troubles.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: 'var(--color-bg-alt)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '10px', padding: '14px 16px',
                      }}
                    >
                      {troubles.length > 1 && (
                        <p style={{
                          fontFamily: 'var(--font-body)', fontSize: '11px',
                          fontWeight: 600, color: 'var(--color-fg-muted)',
                          letterSpacing: '0.06em', margin: '0 0 6px 0',
                        }}>
                          {String(i + 1).padStart(2, '0')}
                        </p>
                      )}
                      <p style={{
                        fontFamily: 'var(--font-body)', fontSize: '14px',
                        fontWeight: 400, lineHeight: 1.75,
                        color: 'var(--color-fg-secondary)', margin: 0,
                      }}>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              )
            })()}

            {/* 링크 버튼 */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {project.github && (
                project.github === 'private' ? (
                  <div
                    title="비공개 저장소"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
                      color: 'var(--color-fg-muted)', backgroundColor: 'var(--color-bg-alt)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '9999px', padding: '9px 18px',
                      cursor: 'default',
                      opacity: 0.5,
                    }}
                  >
                    <Lock size={14} />
                    Private
                  </div>
                ) : (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
                    color: 'var(--color-bg)', backgroundColor: 'var(--color-fg)',
                    border: '1px solid var(--color-fg)',
                    borderRadius: '9999px', padding: '9px 18px',
                    textDecoration: 'none', boxShadow: 'var(--shadow-btn)',
                    transition: 'opacity var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Github size={14} />
                  GitHub
                </a>
                )
              )}
              {project.youtube && (
                <a
                  href={project.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
                    color: 'var(--color-fg)', backgroundColor: 'var(--color-bg-warm)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '9999px', padding: '9px 18px',
                    textDecoration: 'none', boxShadow: 'var(--shadow-warm)',
                    transition: 'opacity var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <Youtube size={14} />
                  YouTube
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500,
                    color: 'var(--color-fg)', backgroundColor: 'var(--color-bg-warm)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '9999px', padding: '9px 18px',
                    textDecoration: 'none', boxShadow: 'var(--shadow-warm)',
                    transition: 'opacity var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <ExternalLink size={14} />
                  배포된 사이트
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}

export default ProjectModal