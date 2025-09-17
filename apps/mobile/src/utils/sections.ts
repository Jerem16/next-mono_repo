/* eslint-disable-next-line */
export let currentSectionId = "";

export function scrollInView(sections: { id: string }[]) {
    currentSectionId = "";
    const scrollPosition = window.scrollY;
    sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const isInView =
                scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight;
            if (isInView) {
                currentSectionId = id;
            }
        }
    });
}

export function updateSectionClasses(
    sections: { id: string }[],
    setActiveSection: (id: string) => void
) {
    sections.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section) {
            if (id === currentSectionId) {
                section.classList.add("active-section");
                setActiveSection(id);
            } else {
                section.classList.remove("active-section");
            }
        }
    });
}

export function addNewUrl(currentSection: string) {
    if (currentSection) {
        const newUrl = `#${currentSection}`;
        if (window.location.hash !== newUrl) {
            window.history.replaceState(null, "", newUrl);
        }
    }
}
