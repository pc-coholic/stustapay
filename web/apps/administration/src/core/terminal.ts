import { Buffer } from "buffer";

export const encodeTerminalRegistrationQrCode = (coreUrl: string, registrationUuid: string): string => {
  const payload = {
    core_url: coreUrl,
    registration_uuid: registrationUuid,
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64");
};
