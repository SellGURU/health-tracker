import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
import { Capacitor } from "@capacitor/core";

export const biometric = {
  async isAvailable(): Promise<boolean> {
    if (Capacitor.getPlatform() === "web") return false;

    try {
      const result = await BiometricAuth.checkBiometry();
      return result.isAvailable;
    } catch (err) {
      console.error("Biometric check failed", err);
      return false;
    }
  },

  async authenticate(): Promise<boolean> {
    if (Capacitor.getPlatform() === "web") return false;

    try {
      await BiometricAuth.authenticate({
        reason: "Authenticate to continue",
        iosFallbackTitle: "Use Passcode",
      });
      return true;
    } catch (error: any) {
      console.error("Biometric authentication failed:", error);
      return false;
    }
  },
};

// import { BiometricAuth } from "@aparajita/capacitor-biometric-auth";
// import { Capacitor } from "@capacitor/core";

// export type BiometricType = "face" | "fingerprint";

// export async function checkBiometric(): Promise<{
//   available: boolean;
//   type?: BiometricType;
// }> {
//   if (Capacitor.getPlatform() === "web") {
//     return { available: false };
//   }

//   try {
//     const result = await BiometricAuth.checkBiometry();

//     if (!result.isAvailable) {
//       return { available: false };
//     }

//     const type: BiometricType = result.biometryType
//       ?.toLowerCase()
//       .includes("face")
//       ? "face"
//       : "fingerprint";

//     return {
//       available: true,
//       type,
//     };
//   } catch {
//     return { available: false };
//   }
// }

// export async function authenticateBiometric(): Promise<boolean> {
//   try {
//     await BiometricAuth.authenticate({
//       reason: "Login with biometrics",
//       iosFallbackTitle: "Use device passcode",
//     });
//     return true;
//   } catch {
//     return false;
//   }
// }
