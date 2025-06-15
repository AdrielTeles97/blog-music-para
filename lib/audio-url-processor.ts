"use client";

/**
 * Funções utilitárias para lidar com URLs de diferentes plataformas de armazenamento
 * e streaming de áudio (Google Drive, Dropbox, SoundCloud, etc.)
 */

/**
 * Processa um link do Google Drive para obter o URL direto para streaming
 * @param url URL original do Google Drive
 * @returns URL processada para streaming direto
 */
export function processGoogleDriveUrl(url: string): string {
    console.log("Processando Google Drive URL:", url);

    try {
        // Extrair ID do arquivo de diferentes formatos de URL do Google Drive
        let fileId = "";

        // Formato: /file/d/{fileId}/view
        if (url.includes("/file/d/")) {
            fileId = url.split("/file/d/")[1].split("/")[0];
        }
        // Formato: /d/{fileId}/view
        else if (url.includes("/d/")) {
            fileId = url.split("/d/")[1].split("/")[0];
        }
        // Formato: id={fileId}
        else if (url.includes("id=")) {
            fileId = url.split("id=")[1].split("&")[0];
        }
        // Buscar por um padrão de ID geral (25+ caracteres alfanuméricos e hífens)
        else {
            const matches = url.match(/[-\w]{25,}/);
            if (matches && matches.length > 0) {
                fileId = matches[0];
            }
        }

        if (!fileId) {
            console.error("Não foi possível extrair o ID do arquivo:", url);
            return url;
        }

        console.log("ID do arquivo extraído:", fileId);

        // Usando o formato mais confiável para streaming de áudio do Google Drive
        // Este formato funciona melhor para arquivos de áudio
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
    } catch (error) {
        console.error("Erro ao processar URL do Google Drive:", error);
        return url;
    }
}

/**
 * Processa um link do Dropbox para obter o URL direto para download
 * @param url URL original do Dropbox
 * @returns URL processada para download direto
 */
export function processDropboxUrl(url: string): string {
    try {
        // Converter www.dropbox.com para dl.dropboxusercontent.com
        // e remover ?dl=0 no final
        let processedUrl = url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
        processedUrl = processedUrl.replace("?dl=0", "");
        return processedUrl;
    } catch (error) {
        console.error("Erro ao processar URL do Dropbox:", error);
        return url;
    }
}

/**
 * Processa um link do SoundCloud para obter o URL direto para streaming
 * Nota: Uma implementação completa requer uma API key do SoundCloud
 * @param url URL original do SoundCloud
 * @returns URL processada para possível streaming
 */
export function processSoundCloudUrl(url: string): string {
    // Infelizmente, o SoundCloud requer uma API key para streaming direto
    // Para uma implementação completa, seria necessário usar a API do SoundCloud
    // ou incorporar o widget do SoundCloud

    try {
        // Extrair o ID da faixa do URL
        const trackPath = url.split("soundcloud.com/")[1];
        if (trackPath) {
            // Esta é uma implementação simplificada que não vai funcionar diretamente
            // devido às restrições da API do SoundCloud
            console.log("SoundCloud track path:", trackPath);

            // Em uma implementação real, você usaria:
            // return `https://api.soundcloud.com/resolve?url=${url}&client_id=YOUR_CLIENT_ID`;
        }
    } catch (error) {
        console.error("Erro ao processar URL do SoundCloud:", error);
    }

    // Retornar o URL original se não conseguir processar
    return url;
}

/**
 * Processa um link de áudio baseado na plataforma
 * @param url URL original do áudio
 * @param platform Plataforma do áudio
 * @returns URL processada para uso no player
 */
export function processAudioUrl(url: string, platform: string): string {
    if (!url) return "";

    switch (platform) {
        case "googledrive":
            return processGoogleDriveUrl(url);
        case "dropbox":
            return processDropboxUrl(url);
        case "soundcloud":
            return processSoundCloudUrl(url);
        default:
            return url;
    }
}

/**
 * Identifica automaticamente a plataforma com base na URL
 * @param url URL do áudio
 * @returns Plataforma identificada
 */
export function identifyPlatform(url: string): "direct" | "soundcloud" | "googledrive" | "dropbox" {
    if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
        return "googledrive";
    } else if (url.includes("dropbox.com")) {
        return "dropbox";
    } else if (url.includes("soundcloud.com")) {
        return "soundcloud";
    } else {
        return "direct";
    }
}

/**
 * Métodos alternativos para tentar reproduzir uma URL de áudio quando o método principal falha
 * @param url URL original
 * @param platform Plataforma do áudio
 * @returns Lista de URLs alternativas para tentar
 */
export function getFallbackUrls(url: string, platform: string): string[] {
    const fallbacks: string[] = [];
    if (platform === "googledrive") {
        // Extrair ID do arquivo
        const fileIdMatch = url.match(/[-\w]{25,}/);
        if (fileIdMatch && fileIdMatch[0]) {
            const fileId = fileIdMatch[0];

            // Método 1: URL Export
            fallbacks.push(`https://drive.google.com/uc?export=download&id=${fileId}`);

            // Método 2: URL Export com open
            fallbacks.push(`https://docs.google.com/uc?export=open&id=${fileId}`);

            // Método 3: URL Export View
            fallbacks.push(`https://drive.google.com/uc?export=view&id=${fileId}`);

            // Método 4: URL com export=media
            fallbacks.push(
                `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=AIzaSyAHIDPKFSVbDwk-NzlAZNp72nNYf7EXVUg`
            );

            // Método 5: URL com export=media (sem key)
            fallbacks.push(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`);

            // Método 6: Link direto alternativo
            fallbacks.push(`https://drive.google.com/file/d/${fileId}/preview`);

            // Método 7: Link de preview no iframe
            fallbacks.push(`https://drive.google.com/file/d/${fileId}/preview?usp=sharing`);
        }
    }

    return fallbacks;
}
