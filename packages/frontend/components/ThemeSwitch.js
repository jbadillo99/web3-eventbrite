import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme, resolvedTheme} = useTheme();

    // Use effect only runs on client, so if client is mounted then we could safely show the UI
    useEffect(() => {
        setMounted(true),
        []
    })

    if(!mounted) {
        return null;
    }

    return (

        <button
            name="darkOrLight"
            id="dark-select"
            className="inline-flex items-center dark:bg-gray-990 light:bg-white px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 border border-indigo-100 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            value={theme}
            onClick={() => setTheme(theme === "light" ? "dark": "light")}
        >
            {theme === "light" ? "Dark": "Light"} Mode
        </button>
    )

};

export default ThemeSwitch;