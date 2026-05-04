document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.content');
    const tocList = document.getElementById('toc-list');
    const tocSidebar = document.getElementById('toc-sidebar');

    if (!content || !tocList) return;

    const normalizeHeading = (text) => text
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^\p{L}\p{N}]+/gu, '');

    const isProject1Page = () => /\/projects\/project-1\/?/.test(window.location.pathname);

    const shouldHideProject1Heading = (heading, allHeadings) => {
        if (!isProject1Page()) return false;

        const text = normalizeHeading(heading.textContent || '');
        const tagName = heading.tagName.toLowerCase();
        const previousSections = allHeadings.slice(0, allHeadings.indexOf(heading));
        const currentH2 = [...previousSections].reverse().find((item) => item.tagName.toLowerCase() === 'h2');
        const currentH2Text = normalizeHeading(currentH2?.textContent || '');

        const hiddenExact = new Set([
            'strike',
            'vanguard',
            'support',
            '팀보상믹싱teamrewardmixingmappocooperativesignal',
            'teamrewardmixingmappocooperativesignal',
            'ue5python보상파이프라인rewardpipeline',
            'ue5pythonrewardpipeline',
            '실험설계',
            'experimentaldesign',
            '종합',
            'summary',
        ]);

        if (hiddenExact.has(text)) return true;
        if (text.startsWith('1단계') || text.startsWith('step1')) return true;
        if (text.startsWith('2단계') || text.startsWith('step2')) return true;

        const isSubheading = tagName === 'h4' || tagName === 'h5' || tagName === 'h6';
        const isKeyFeatures = currentH2Text.includes('주요기능') || currentH2Text.includes('keyfeatures');
        const isProblemSolving = currentH2Text.includes('기술적난제') || currentH2Text.includes('problemsolving');

        if (isSubheading && isKeyFeatures) {
            return !text.startsWith('1dynamiceqs')
                && !text.startsWith('2mappo')
                && !text.startsWith('3aws');
        }

        if (isSubheading && isProblemSolving) {
            return !text.startsWith('problem1')
                && !text.startsWith('problem2')
                && !text.startsWith('problem3');
        }

        return false;
    };

    const allHeadings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const headings = allHeadings.filter((heading) => !shouldHideProject1Heading(heading, allHeadings));

    if (headings.length === 0) {
        if (tocSidebar) tocSidebar.style.display = 'none';
        return;
    }

    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }

        const level = heading.tagName.toLowerCase().replace('h', '');

        const li = document.createElement('li');
        li.className = 'toc-item';

        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.className = `toc-link toc-level-${level}`;

        const indicator = document.createElement('span');
        indicator.className = 'toc-indicator';

        const text = document.createElement('span');
        text.className = 'toc-text';
        text.textContent = heading.textContent;

        a.appendChild(indicator);
        a.appendChild(text);
        li.appendChild(a);
        tocList.appendChild(li);

        a.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, `#${heading.id}`);
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.toc-link').forEach(link => {
                    link.classList.remove('active');
                });

                const activeLink = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    headings.forEach(heading => observer.observe(heading));
});
