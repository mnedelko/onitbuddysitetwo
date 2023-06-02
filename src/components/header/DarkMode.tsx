const DarkMode = () => {
    //let clickedClass = "clicked"
    const body = document.body
    const lightTheme = "light"
    const darkTheme = "is_dark"
    let theme: any

    if (localStorage) {
        theme = localStorage.getItem("theme")
    }
    if (theme === lightTheme || theme === darkTheme) {
        body.classList.add(theme)
    } else {
        body.classList.add(darkTheme)
    }

    /* const switchTheme = (e: { target: any }) => {
        if (theme === darkTheme) {
            body.classList.replace(darkTheme, lightTheme)
            e.target.classList.remove(clickedClass)
            localStorage.setItem("theme", "is_dark")
            theme = darkTheme
        } else {
            body.classList.replace(lightTheme, darkTheme)
            e.target.classList.add(clickedClass)
            localStorage.setItem("theme", "is_dark")
            theme = darkTheme
        }
    } */
    return (
        <div className="mode_switcher">

    </div>
    );
}

export default DarkMode;
