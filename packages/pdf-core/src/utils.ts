/**
 * Ensures a value is not null or undefined, throws if it is.
 * @param value The value to check
 * @param message Error message if null
 */
export function assertNonNull<T>(
  value: T | null | undefined,
  message: string,
): T {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}

/**
 * Returns the device pixel ratio, defaults to 1 if not in browser.
 */
export function getDevicePixelRatio(): number {
  if (
    typeof globalThis !== "undefined" &&
    typeof globalThis.devicePixelRatio === "number"
  ) {
    return globalThis.devicePixelRatio;
  }
  return 1;
}
