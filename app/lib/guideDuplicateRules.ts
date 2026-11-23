/**
 * Only suppress overlapping catalog *presentations*, never delete documents.
 * Adaptations/settings remain independent of the initial assist activation.
 */
export function isLaneAssistActivation(name: string): boolean {
  const lane = /lane[ -]?assist|spurhalteassistent|spurhalteassist/i.test(name);
  const enable = /aktivier|freischalt/i.test(name);
  const adaptation = /anpass|einstell|speicher|merk|warn|vibration|lenkeingriff|kalibrier/i.test(name);
  return lane && enable && !adaptation;
}

/** A combined camera retrofit PDF supersedes separately listed retrofit drafts. */
export function isEarlierRearCameraRetrofit(name: string): boolean {
  return /rückfahrkamera|rueckfahrkamera|rear view/i.test(name)
    && /nachrüst|nachruest/i.test(name);
}

/** Activating an already-installed camera is a coding, not installing a new assist system. */
export function isRearCameraActivationCoding(name: string): boolean {
  return /rückfahrkamera|rueckfahrkamera|rear view/i.test(name)
    && /aktivier|freischalt/i.test(name)
    && !/nachrüsten|nachruesten/i.test(name);
}
