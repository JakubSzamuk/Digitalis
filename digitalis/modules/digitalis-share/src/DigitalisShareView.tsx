import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { DigitalisShareViewProps } from './DigitalisShare.types';

const NativeView: React.ComponentType<DigitalisShareViewProps> =
  requireNativeViewManager('DigitalisShare');

export default function DigitalisShareView(props: DigitalisShareViewProps) {
  return <NativeView {...props} />;
}
