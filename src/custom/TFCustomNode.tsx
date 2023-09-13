import React, { FC } from 'react';
import { SphereWithIconProps } from '../symbols/nodes/SphereWithIcon';
import { TFSphereWithBorder } from './TFSphereWithBorder';
import { Icon } from '../symbols/nodes/Icon';
import { Label } from '../symbols/Label';
import { a } from '@react-spring/three';
import { RoundedBox } from '@react-three/drei';

export interface TFCustomNodeProps extends SphereWithIconProps {
  borderColor: string;
  counter: string;
}

export const TFCustomNode: FC<TFCustomNodeProps> = ({
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
      <TFSphereWithBorder
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

TFCustomNode.defaultProps = {
  opacity: 1,
  active: false,
  selected: false
};
