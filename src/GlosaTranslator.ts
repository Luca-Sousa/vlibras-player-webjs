import { config } from './config';

/**
 * Callback para resultado da tradução
 */
export type TranslationCallback = (gloss: string | null, error: string | null) => void;

/**
 * Classe responsável por traduzir texto para glosa (linguagem de sinais)
 */
export class GlosaTranslator {
  private translatorUrl: string;
  private timeout: number;

  constructor(translatorUrl: string = config.translatorUrl, timeout: number = config.requestTimeout) {
    this.translatorUrl = translatorUrl;
    this.timeout = timeout;
  }

  /**
   * Traduz texto para glosa
   * @param text Texto a ser traduzido
   * @param host Host da requisição
   * @param callback Callback executado após tradução
   */
  async translate(text: string, host: string, callback: TranslationCallback): Promise<void> {
    try {
      const response = await this.makeTranslationRequest(text, host);
      
      if (response.ok) {
        const gloss = await response.text();
        callback(gloss, null);
      } else {
        const error = `HTTP ${response.status}: ${response.statusText}`;
        callback(null, error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'unknown_error';
      
      // Mantém compatibilidade com erro de timeout
      if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
        callback(null, 'timeout_error');
      } else {
        callback(null, errorMessage);
      }
    }
  }

  /**
   * Faz a requisição de tradução para o serviço
   */
  private async makeTranslationRequest(text: string, host: string): Promise<Response> {
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
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Atualiza a URL do tradutor
   */
  setTranslatorUrl(url: string): void {
    this.translatorUrl = url;
  }

  /**
   * Atualiza o timeout das requisições
   */
  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  /**
   * Obtém a URL atual do tradutor
   */
  getTranslatorUrl(): string {
    return this.translatorUrl;
  }

  /**
   * Obtém o timeout atual
   */
  getTimeout(): number {
    return this.timeout;
  }
}
