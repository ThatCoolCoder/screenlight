# Screenlight

A simple program to turn your device's screen into a light that cycles through different colors. Each lighting preset you make can contain multiple "slides", which have adjustable duration and transitioning. These slides can in turn be split into sections of different color and width.

The inspiration for creating this project was to be able to send signals to people at night, eg warning them about a hazard.

Built with React/Mantine/Tailwind.

Roadmap:
- preset editor:
    - confirm save/delete changes on exit only if unsaved (useEffect in editor where it normally checks for changes)
    - allow reordering slide sections (easy) and slides (hard).
- potentially an option to have 2 types of transition:
    - current one
    - have 2 layers and alternate opacity (wouldn't be that hard, just need to keep track of previous in Background)
- general
    - consider using immer or something idk or just reducers
    - not pass slide around just the name. that seems to be the react way
    - persistence of last used causes it to not save changes due to having multiple settings values floating around (switch to zustand?)
    - have a popup on load when it detects there are new inbuilts that you click and can auto restore (just count number of inbuilts in default to curr)
        - have a never show again option that can be undone in the general tab of advanced settings
        - make import just take you to advanced settings restore inbuilts
        - and have a little info thing there telling you to click if it detects
- a few more inbuilt presets
- add screenshot to readme
- favicon
- deploy