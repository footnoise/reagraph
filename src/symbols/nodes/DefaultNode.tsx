import React, { FC } from 'react';
import { SphereWithIconProps } from './SphereWithIcon';
import { SphereWithBorder } from './SphereWithBorder';
import { Icon } from './Icon';
import { Ring } from '../Ring';
import { Label } from '../Label';
import { DoubleSide } from 'three';
import { useSpring, a } from '@react-spring/three';
import { RoundedBox } from '@react-three/drei';
import { counter } from '@fortawesome/fontawesome-svg-core';

export interface DefaultNodeProps extends SphereWithIconProps {
  borderColor: string;
  counter: string;
}

export const DefaultNode: FC<DefaultNodeProps> = ({
  color,
  borderColor,
  id,
  size,
  opacity,
  node,
  active,
  animated,
  image,
  counter
}) => {
  return (
    <>
      <SphereWithBorder
        id={id}
        size={size}
        opacity={opacity}
        animated={animated}
        color={node.fill}
        borderColor={borderColor}
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
      {counter && (
        <a.group position={[size, size, 30]}>
          <RoundedBox args={[counter.length * 5 + 5, 10, 0]} radius={5}>
            <meshPhongMaterial color="#8fe8b5" />
          </RoundedBox>
          <Label text={counter} opacity={opacity} color={'#ffffff'} />
        </a.group>
      )}
    </>
  );
};

DefaultNode.defaultProps = {
  opacity: 1,
  active: false,
  selected: false
};
