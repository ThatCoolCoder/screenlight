# Screenlight

A simple program to turn your device's screen into a light that cycles through different colors. Each lighting preset you make can contain multiple "slides", which have adjustable duration and transitioning. These slides can in turn be split into sections of different color and width.

The inspiration for creating this project was to be able to send signals to people at night, such as warning them about a hazard that they cannot see.

Built with React/Mantine/Tailwind.

Roadmap:
- switch to id-based persistence so that duplicate names do not completely fry the system.
- make a switch for horizontal or vertical orientation of sections in slides 
- overhaul confirm dialogs etc
- import/export functionality
- a few more inbuilt presets
- ability to restore inbuilt presets (or potentially just prevent destroying them)