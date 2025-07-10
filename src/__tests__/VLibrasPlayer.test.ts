import { VLibrasPlayer } from '../VLibrasPlayer';
import { PlayerStatus } from '../types';

describe('VLibrasPlayer', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should create player instance', () => {
    const player = new VLibrasPlayer();
    expect(player).toBeInstanceOf(VLibrasPlayer);
    expect(player.getStatus()).toBe(PlayerStatus.IDLE);
  });

  test('should accept configuration options', () => {
    const config = {
      targetPath: './custom/path',
      translator: 'https://custom-translator.com'
    };

    const player = new VLibrasPlayer(config);
    expect(player).toBeInstanceOf(VLibrasPlayer);
  });

  test('should have initial state', () => {
    const player = new VLibrasPlayer();
    
    expect(player.getStatus()).toBe(PlayerStatus.IDLE);
    expect(player.isLoaded()).toBe(false);
    expect(player.getRegion()).toBe('BR');
    expect(player.getText()).toBeUndefined();
    expect(player.getGloss()).toBeUndefined();
  });

  test('should change region', () => {
    const player = new VLibrasPlayer();
    
    player.setRegion('SP');
    expect(player.getRegion()).toBe('SP');
  });

  test('should load player in container', () => {
    const player = new VLibrasPlayer();
    
    player.load(container);
    
    expect(container.children.length).toBeGreaterThan(0);
    const gameContainer = container.querySelector('#vlibras-game-container');
    expect(gameContainer).toBeTruthy();
  });
});
