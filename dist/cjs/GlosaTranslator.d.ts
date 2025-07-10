/**
 * Callback para resultado da tradução
 */
export type TranslationCallback = (gloss: string | null, error: string | null) => void;
/**
 * Classe responsável por traduzir texto para glosa (linguagem de sinais)
 */
export declare class GlosaTranslator {
    private translatorUrl;
    private timeout;
    constructor(translatorUrl?: string, timeout?: number);
    /**
     * Traduz texto para glosa
     * @param text Texto a ser traduzido
     * @param host Host da requisição
     * @param callback Callback executado após tradução
     */
    translate(text: string, host: string, callback: TranslationCallback): Promise<void>;
    /**
     * Faz a requisição de tradução para o serviço
     */
    private makeTranslationRequest;
    /**
     * Atualiza a URL do tradutor
     */
    setTranslatorUrl(url: string): void;
    /**
     * Atualiza o timeout das requisições
     */
    setTimeout(timeout: number): void;
    /**
     * Obtém a URL atual do tradutor
     */
    getTranslatorUrl(): string;
    /**
     * Obtém o timeout atual
     */
    getTimeout(): number;
}
//# sourceMappingURL=GlosaTranslator.d.ts.map