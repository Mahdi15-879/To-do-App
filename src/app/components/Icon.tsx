import * as Icons from "iconsax-react";

export type TIconName = keyof typeof Icons;

interface IconProps {
  icon: TIconName;
  [key: string]: any;
}

const Icon = ({ icon, ...rest }: IconProps) => {
  const IconComponent = Icons[icon as TIconName];
  if (!IconComponent) {
    return null;
  }
  return <IconComponent {...rest} />;
};

export default Icon;
