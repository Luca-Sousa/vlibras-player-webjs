import { config } from './config';
/**
 * Classe responsável por traduzir texto para glosa (linguagem de sinais)
 */
export class GlosaTranslator {
    constructor(translatorUrl = config.translatorUrl, timeout = config.requestTimeout) {
        this.translatorUrl = translatorUrl;
        this.timeout = timeout;
    }
    /**
     * Traduz texto para glosa
     * @param text Texto a ser traduzido
     * @param host Host da requisição
     * @param callback Callback executado após tradução
     */
    async translate(text, host, callback) {
        try {
            const response = await this.makeTranslationRequest(text, host);
            if (response.ok) {
                const gloss = await response.text();
                callback(gloss, null);
            }
            else {
                const error = `HTTP ${response.status}: ${response.statusText}`;
                callback(null, error);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'unknown_error';
            // Mantém compatibilidade com erro de timeout
            if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
                callback(null, 'timeout_error');
            }
            else {
                callback(null, errorMessage);
            }
        }
    }
    /**
     * Faz a requisição de tradução para o serviço
     */
    async makeTranslationRequest(text, host) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const formData = new FormData();
            formData.append('texto', text);
            formData.append('host', host);
            const response = await fetch(this.translatorUrl, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
                headers: {
                    'Accept': 'text/plain, */*',
                }
            });
            return response;
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    /**
     * Atualiza a URL do tradutor
     */
    setTranslatorUrl(url) {
        this.translatorUrl = url;
    }
    /**
     * Atualiza o timeout das requisições
     */
    setTimeout(timeout) {
        this.timeout = timeout;
    }
    /**
     * Obtém a URL atual do tradutor
     */
    getTranslatorUrl() {
        return this.translatorUrl;
    }
    /**
     * Obtém o timeout atual
     */
    getTimeout() {
        return this.timeout;
    }
}
//# sourceMappingURL=GlosaTranslator.js.map