import * as React from 'react';

import { DigitalisShareViewProps } from './DigitalisShare.types';

export default function DigitalisShareView(props: DigitalisShareViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
