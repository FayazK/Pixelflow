import {Cog, Moon, Sun} from "lucide-react";
import React from "react";

export default function ({setShowSettings, toggleDarkMode, darkMode}) {
    return (<header className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-indigo-600 text-white'} shadow-md`}>
        <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold">Pixelflow</h1>
            <div className="flex gap-2">
                <button
                    onClick={() => setShowSettings(true)}
                    className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-500 hover:bg-indigo-400'}`}
                ><Cog size={20}/>
                </button>
                <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-indigo-500 hover:bg-indigo-400'}`}
                >
                    {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
                </button>
            </div>
        </div>
    </header>);
}