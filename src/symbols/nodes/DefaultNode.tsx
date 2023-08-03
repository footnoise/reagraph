import React, { FC } from 'react';
import { SphereWithIconProps } from './SphereWithIcon';
import { Sphere } from './Sphere';
import { Icon } from './Icon';

export const DefaultNode: FC<SphereWithIconProps> = ({
  color,
  id,
  size,
  opacity,
  node,
  active,
  animated,
  image
}) => (
  <>
    <Sphere
      id={id}
      size={size}
      opacity={opacity}
      animated={animated}
      color={color}
      node={node}
      active={active}
    />
    <Icon
      id={id}
      image={image}
      size={size}
      opacity={opacity}
      animated={animated}
      color={color}
      node={node}
      active={active}
    />
  </>
);

DefaultNode.defaultProps = {
  opacity: 1,
  active: false,
  selected: false
};
