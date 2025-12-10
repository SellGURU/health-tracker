import { useState, useEffect, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import VersionControll from "@/api/VersionControll";
import { compareVersions } from "@/utils/version";
import packageJson from "../../../package.json";

interface VersionConfig {
  version?: string;
  minimumSupportedVersion?: string;
  downloadUrl?: string;
  downloadLink?: string;
  playStoreUrl?: string;
  maintenance?: boolean;
}

interface VersionCheckResult {
  showUpdateModal: boolean;
  showUnsupportedModal: boolean;
  downloadLink: string;
}

const CURRENT_VERSION = packageJson.version;
const CHECK_INTERVAL = 60000; // 60 seconds

export function useVersionCheck() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showUnsupportedModal, setShowUnsupportedModal] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [playStoreLink, setPlayStoreLink] = useState<string>("");

  // اگر نسخه وب بود، هیچ مودالی نمایش داده نشود
  const isWeb = !Capacitor.isNativePlatform();

  const checkVersion = useCallback((config: VersionConfig) => {
    if (!config) return;
    
    // اگر نسخه وب بود، هیچ مودالی نمایش داده نشود
    if (isWeb) {
      setShowUpdateModal(false);
      setShowUnsupportedModal(false);
      return;
    }

    const { version, minimumSupportedVersion, downloadUrl, downloadLink, playStoreUrl } = config;
    
    // Use downloadLink if available, otherwise fallback to downloadUrl
    const finalDownloadLink = downloadLink || downloadUrl;

    // Check if current version is less than minimum supported version
    if (
      minimumSupportedVersion &&
      compareVersions(CURRENT_VERSION, minimumSupportedVersion) < 0
    ) {
      setShowUnsupportedModal(true);
      if (finalDownloadLink) {
        setDownloadLink(finalDownloadLink);
      }
      if (playStoreUrl) {
        setPlayStoreLink(playStoreUrl);
      }
      return;
    }

    // Check if current version is less than latest version
    if (version && compareVersions(CURRENT_VERSION, version) < 0) {
      setShowUpdateModal(true);
      if (finalDownloadLink) {
        setDownloadLink(finalDownloadLink);
      }
      if (playStoreUrl) {
        setPlayStoreLink(playStoreUrl);
      }
    }
  }, [isWeb]);

  const checkConfig = useCallback(() => {
    // اگر نسخه وب بود، نیازی به چک کردن نسخه نیست
    if (isWeb) {
      setShowUpdateModal(false);
      setShowUnsupportedModal(false);
      return;
    }
    
    VersionControll.getConfig()
      .then((res) => {
        const platform = Capacitor.getPlatform();
        // اگر نسخه iOS بود، config مربوط به iOS را بخوان، در غیر این صورت Android
        const platformConfig = platform === 'ios' ? res.data.ios : res.data.android;
        checkVersion(platformConfig);
      })
      .catch((error) => {
        console.error("Error fetching version config:", error);
      });
  }, [checkVersion, isWeb]);

  useEffect(() => {
    // اگر نسخه وب بود، نیازی به چک کردن نسخه نیست
    if (isWeb) {
      setShowUpdateModal(false);
      setShowUnsupportedModal(false);
      return;
    }
    
    checkConfig();
    const interval = setInterval(checkConfig, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkConfig, isWeb]);

  // اگر نسخه وب بود، همیشه false برگردان
  return {
    showUpdateModal: isWeb ? false : showUpdateModal,
    showUnsupportedModal: isWeb ? false : showUnsupportedModal,
    downloadLink,
    playStoreLink,
    setShowUpdateModal,
  };
}

