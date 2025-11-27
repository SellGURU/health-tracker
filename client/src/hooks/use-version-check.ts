import { useState, useEffect, useCallback } from "react";
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

  const checkVersion = useCallback((config: VersionConfig) => {
    if (!config) return;

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
  }, []);

  const checkConfig = useCallback(() => {
    VersionControll.getConfig()
      .then((res) => {
        const androidConfig = res.data.android;
        checkVersion(androidConfig);
      })
      .catch((error) => {
        console.error("Error fetching version config:", error);
      });
  }, [checkVersion]);

  useEffect(() => {
    checkConfig();
    const interval = setInterval(checkConfig, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkConfig]);

  return {
    showUpdateModal,
    showUnsupportedModal,
    downloadLink,
    playStoreLink,
    setShowUpdateModal,
  };
}

