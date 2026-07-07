import path from "path";

export const PANDOC_VERSION = "3.10";

export function getExecutable(platform: NodeJS.Platform): string {
    return platform === "win32" ? "pandoc.exe" : "pandoc";
}

export function getFolder(): string {
    return `pandoc-${PANDOC_VERSION}`;
}


const PANDOC_BASE_URL = "https://github.com/jgm/pandoc/releases/download";

export function getDownloadUrl(platform: NodeJS.Platform, arch: string): string {
    switch (platform) {
        case "win32":
            return `${PANDOC_BASE_URL}/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-windows-x86_64.zip`;

        case "darwin":
            switch (arch) {
                case "arm64":
                    return `${PANDOC_BASE_URL}/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-arm64-macOS.zip`;
                case "x64":
                    return `${PANDOC_BASE_URL}/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-x86_64-macOS.zip`;
                default:
                    throw new Error(`Unsupported macOS architecture: ${arch}`);
            }

        case "linux":
            switch (arch) {
                case "arm64":
                    return `${PANDOC_BASE_URL}/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-linux-arm64.tar.gz`;
                case "x64":
                    return `${PANDOC_BASE_URL}/${PANDOC_VERSION}/pandoc-${PANDOC_VERSION}-linux-amd64.tar.gz`;
                default:
                    throw new Error(`Unsupported Linux architecture: ${arch}`);
            }

        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
}
