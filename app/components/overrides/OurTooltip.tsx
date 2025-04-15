import { Tooltip } from "@mantine/core";

export const OurTooltip = Tooltip.withProps({
    events: { hover: true, focus: true, touch: false }
});

