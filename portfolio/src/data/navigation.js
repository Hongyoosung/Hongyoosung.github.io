export const navLinks = [
    { id: 'about', label: { ko: 'About', en: 'About' }, type: 'section' },
    { id: 'projects', label: { ko: 'Projects', en: 'Projects' }, type: 'section' },
    { id: 'skills', label: { ko: 'Skills', en: 'Skills' }, type: 'section' },
    { id: 'activation', label: { ko: 'Activation', en: 'Activation' }, type: 'section' },
    { id: 'experience', label: { ko: 'Experience', en: 'Experience' }, type: 'section' },
    { id: 'publications', label: { ko: 'Research', en: 'Research' }, type: 'page', path: '/publications' },
    { id: 'news', label: { ko: '뉴스', en: 'News' }, type: 'page', path: '/news' },
    { id: 'contact', label: { ko: 'Contact', en: 'Contact' }, type: 'section' },
]

// Language-specific resume file. Drop the PDFs at:
//   static/resume/yoosung-hong-resume-en.pdf
//   static/resume/yoosung-hong-resume-ko.pdf
export const resumeFiles = {
    en: '/resume/yoosung-hong-resume-en.pdf',
    ko: '/resume/yoosung-hong-resume-ko.pdf',
}

export const resumeLabel = { ko: '이력서', en: 'Resume' }
