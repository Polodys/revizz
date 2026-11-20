const dataFile = (path) => new URL(`./data/${path}`, import.meta.url).href;

export const quizCatalog = [
    {
        id: "maths-2de",
        label: "Mathématiques - 2de",
        topics: [
            {
                id: "maths-2de-algebre",
                label: "Algèbre",
                file: dataFile("maths-2de/nombres-et-calculs-algebre/algebre.json")
            },
            {
                id: "maths-2de-arithmetique",
                label: "Arithmétique",
                file: dataFile("maths-2de/nombres-et-calculs-algebre/arithmetique.json")
            },
            {
                id: "maths-2de-nombres-reels",
                label: "Nombres réels",
                file: dataFile("maths-2de/nombres-et-calculs-algebre/nombres-reels.json")
            },
        ]
    },
    {
        id: "maths-3e",
        label: "Mathématiques - 3e",
        topics: [
            {
                id: "maths-3e-general",
                label: "Ensemble du programme",
                file: dataFile("maths-3e/general.json")
            }
        ]
    },
    {
        id: "phys-chimie-3e",
        label: "Physique-Chimie - 3e",
        topics: [
            {
                id: "phys-chimie-3e-phys-chimie-3e-electricite",
                label: "Electricité",
                file: dataFile("phys-chimie-3e/electricite.json")
            },
            {
                id: "phys-chimie-3e-energie",
                label: "Energie",
                file: dataFile("phys-chimie-3e/energie.json")
            },
            {
                id: "phys-chimie-3e-mvts-et-interactions",
                label: "Mouvements et interactions",
                file: dataFile("phys-chimie-3e/mvts-et-interactions.json")
            },
            {
                id: "phys-chimie-3e-org-transfo-matiere",
                label: "Organisation et transformation de la matière",
                file: dataFile("phys-chimie-3e/org-transfo-matiere.json")
            }
        ]
    },
    {
        id: "svt-2de",
        label: "Sciences de la Vie et de la Terre - 2de",
        topics: [
            {
                id: "svt-2de-terre-vie-org-vivant",
                label: "La Terre, la vie et l'organisation du vivant",
                file: dataFile("svt-2de/terre-vie-org-vivant.json")
            }
        ]
    }
];