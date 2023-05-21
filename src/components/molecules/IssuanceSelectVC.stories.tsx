import { Meta, Story } from "@storybook/react/types-6-0";

import { manifest, presentationVCIDs } from "../../fixtures";
import { SelectVC as Component, SelectVCProps as Props } from "./IssuanceSelectVC";

export default {
  title: "Molecules/IssuanceSelectVC",
  component: Component,
} as Meta;

const Template: Story<Props> = (args) => <Component {...args} />;

export const IssuanceSelectVC = Template.bind({});
IssuanceSelectVC.args = {
  manifest,
  presentationVCIDs,
};
