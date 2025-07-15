import React, { useState } from 'react';
import { useVLibrasContext } from './VLibrasProvider';
import { useVLibrasAccessibility } from '../hooks/useVLibrasAccessibility';

export interface VLibrasSettingsProps {
  showQuickSettings?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onSettingsChange?: (settings: any) => void;
  className?: string;
}

export const VLibrasSettings: React.FC<VLibrasSettingsProps> = ({
  showQuickSettings = true,
  position = 'top-right',
  onSettingsChange,
  className = ''
}) => {
  const { config, updateConfig } = useVLibrasContext();
  const accessibility = useVLibrasAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleSpeedChange = (speed: number) => {
    updateConfig({ playbackSpeed: speed });
    onSettingsChange?.({ playbackSpeed: speed });
    accessibility.announce(`Velocidade alterada para ${speed}x`);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto' | 'high-contrast') => {
    updateConfig({ theme });
    onSettingsChange?.({ theme });
    accessibility.announce(`Tema alterado para ${theme}`);
  };

  const handleAccessibilityToggle = (option: string, value: boolean) => {
    accessibility.updateOptions({ [option]: value });
    accessibility.announce(`${option} ${value ? 'ativado' : 'desativado'}`);
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4', 
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (!showQuickSettings) return null;

  return (
    <div className={`vlibras-settings fixed ${positionClasses[position]} z-50 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="vlibras-settings-toggle bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isOpen ? 'Fechar configurações' : 'Abrir configurações'}
        aria-expanded={isOpen}
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="vlibras-settings-panel absolute top-14 right-0 bg-white rounded-lg shadow-xl border p-4 w-80 max-h-96 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Configurações VLibras</h3>
            
            {/* Velocidade de Reprodução */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Velocidade de Reprodução
              </label>
              <div className="flex space-x-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-3 py-1 rounded text-sm ${
                      config.playbackSpeed === speed 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    aria-pressed={config.playbackSpeed === speed}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Tema */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tema</label>
              <select
                value={config.theme || 'auto'}
                onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'auto' | 'high-contrast')}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="auto">Automático</option>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="high-contrast">Alto Contraste</option>
              </select>
            </div>

            {/* Acessibilidade */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Acessibilidade</h4>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={accessibility.options.announceTranslations}
                    onChange={(e) => handleAccessibilityToggle('announceTranslations', e.target.checked)}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Anunciar traduções</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={accessibility.options.enableKeyboardNav}
                    onChange={(e) => handleAccessibilityToggle('enableKeyboardNav', e.target.checked)}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Navegação por teclado</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={accessibility.options.enableReducedMotion}
                    onChange={(e) => handleAccessibilityToggle('enableReducedMotion', e.target.checked)}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Reduzir animações</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={accessibility.options.enableHighContrast}
                    onChange={(e) => handleAccessibilityToggle('enableHighContrast', e.target.checked)}
                    className="rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm">Alto contraste</span>
                </label>
              </div>
            </div>

            {/* Tamanho do Texto */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tamanho do Texto</label>
              <select
                value={accessibility.options.textSize || 'medium'}
                onChange={(e) => accessibility.updateOptions({ textSize: e.target.value as any })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Pequeno</option>
                <option value="medium">Médio</option>
                <option value="large">Grande</option>
                <option value="x-large">Extra Grande</option>
              </select>
            </div>

            {/* Atalhos de Teclado */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Atalhos de Teclado</h4>
              <div className="text-xs space-y-1 text-gray-600">
                {Object.entries(accessibility.getKeyboardShortcuts()).map(([key, description]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono bg-gray-100 px-1 rounded">{key}</span>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
