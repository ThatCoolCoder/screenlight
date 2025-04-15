# Screenlight

A simple program to turn your device's screen into a light that cycles through different colors. Each lighting preset you make can contain multiple "slides", which have adjustable duration and transitioning. These slides can in turn be split into sections of different color and width.

The inspiration for creating this project was to be able to send signals to people at night, such as warning them about a hazard that they cannot see.

Built with React/Mantine/Tailwind.

Roadmap:
- improve resilience of persistence and saving to prevent invalid or duplicate names of presets
- preset editor:
    - way to have direct input in color things
    - explanation for transition
    - confirm save/delete changes on exit if unsaved (useEffect in editor where it normally checks for changes)
    - allow reordering slide sections (easy) and slides (hard).
- advanced options
    - polish import/export
    - ability to restore inbuilt presets
- general
    - overhaul all confirm dialogs etc
    - validation stuffs
- add flag to inbuilt presets to prevent deleting
- a few more inbuilt presets
- add screenshot to readme
- favicon
- deploy