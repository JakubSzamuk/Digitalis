import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";

// Import the native module. On web, it will be resolved to DigitalisShare.web.ts
// and on native platforms to DigitalisShare.ts
import DigitalisShareModule from "./src/DigitalisShareModule";
import DigitalisShareView from "./src/DigitalisShareView";
import {
  ChangeEventPayload,
  DigitalisShareViewProps,
} from "./src/DigitalisShare.types";

// Get the native constant value.
// export const PI = DigitalisShareModule.PI;

export function initialise(): string {
  return DigitalisShareModule.initialise();
}
export function isInitialised(): boolean {
  return DigitalisShareModule.isInitialised();
}

export function startDiscovery() {
  return DigitalisShareModule.startDiscovery();
}
export function stopDiscovery() {
  return DigitalisShareModule.stopDiscovery();
}

export function makeDiscoverable() {
  return DigitalisShareModule.makeDiscoverable();
}
export function connectTo(mac_address: String) {
  return DigitalisShareModule.connectTo(mac_address);
}

export async function setValueAsync(value: string) {
  return await DigitalisShareModule.setValueAsync(value);
}

const emitter = new EventEmitter(
  DigitalisShareModule ?? NativeModulesProxy.DigitalisShare
);

export function addDiscoveryListener(
  listener: (event: ChangeEventPayload) => void
): Subscription {
  return emitter.addListener<ChangeEventPayload>("onFoundDevice", listener);
}

export { DigitalisShareView, DigitalisShareViewProps, ChangeEventPayload };
