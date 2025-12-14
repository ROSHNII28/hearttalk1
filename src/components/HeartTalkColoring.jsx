import { useEffect, useRef, useState } from 'react';

export default function PlayGamesHub() {
  const [activeGame, setActiveGame] = useState('home');

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>
          <span style={styles.titleAccent}>JOY HUB</span>  🎮
        </h1>
        <p style={styles.subtitle}>Fun games to relax and enjoy!</p>
      </div>

      {/* HOME - GAME SELECTION */}
      {activeGame === 'home' && (
        <div style={styles.homeGrid}>
          <div style={styles.card} onClick={() => setActiveGame('memory')}>
            <div style={styles.cardIcon}>🎴</div>
            <h2 style={styles.cardTitle}>Memory Match</h2>
            <p style={styles.cardDesc}>Find all the matching pairs!</p>
          </div>

          <div style={styles.card} onClick={() => setActiveGame('coloring')}>
            <div style={styles.cardIcon}>🎨</div>
            <h2 style={styles.cardTitle}>Color & Heal</h2>
            <p style={styles.cardDesc}>Draw and decorate with colors</p>
          </div>
        </div>
      )}

      {/* MEMORY GAME */}
      {activeGame === 'memory' && (
        <div style={styles.pageContent}>
          <button style={styles.backBtn} onClick={() => setActiveGame('home')}>← Back to Hub</button>
          <MemoryGame />
        </div>
      )}

      {/* COLORING GAME */}
      {activeGame === 'coloring' && (
        <div style={styles.pageContent}>
          <button style={styles.backBtn} onClick={() => setActiveGame('home')}>← Back to Hub</button>
          <ColoringGame />
        </div>
      )}
    </div>
  );
}

/* ==================== MEMORY GAME ==================== */
function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const emojis = ['🌸', '🦋', '🌈', '⭐', '🍓', '🎀', '💝', '🌺'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, matched: false }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);
        
        if (newMatched.length === cards.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div style={memoryStyles.gameCard}>
      <h1 style={memoryStyles.title}>
        <span style={memoryStyles.titleEmoji}>🎴</span> Memory Match
      </h1>
      <p style={memoryStyles.subtitle}>Find all the matching pairs!</p>

      <div style={memoryStyles.statsBar}>
        <div style={memoryStyles.statBox}>
          <span style={memoryStyles.statLabel}>Moves</span>
          <span style={memoryStyles.statValue}>{moves}</span>
        </div>
        <div style={memoryStyles.statBox}>
          <span style={memoryStyles.statLabel}>Matched</span>
          <span style={memoryStyles.statValue}>{matched.length / 2} / {emojis.length}</span>
        </div>
      </div>

      <div style={memoryStyles.grid}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            style={{
              ...memoryStyles.card,
              ...(flipped.includes(index) || matched.includes(index) ? memoryStyles.cardFlipped : {}),
            }}
            onClick={() => handleCardClick(index)}
          >
            {flipped.includes(index) || matched.includes(index) ? (
              <span style={memoryStyles.cardEmoji}>{card.emoji}</span>
            ) : (
              <span style={memoryStyles.cardBack}>?</span>
            )}
          </div>
        ))}
      </div>

      <button style={memoryStyles.resetBtn} onClick={initializeGame}>
        🔄 New Game
      </button>

      {gameWon && (
        <div style={memoryStyles.winModal}>
          <div style={memoryStyles.winContent}>
            <h2 style={memoryStyles.winTitle}>🎉 Congratulations! 🎉</h2>
            <p style={memoryStyles.winText}>You won in {moves} moves!</p>
            <button style={memoryStyles.winBtn} onClick={initializeGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== COLORING GAME ==================== */
function ColoringGame() {
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState('#FFB7C5');
  const [brushSize, setBrushSize] = useState(15);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [stickersOnCanvas, setStickersOnCanvas] = useState([]);

  const colorPalette = [
    '#FFB7C5', '#FFD3B6', '#FFE9B0', '#F7FFC9', '#A8E6CF', '#ACE7FF', '#B8B4E3'
  ];

  const stickers = ['🌸', '❤️', '⭐', '✨', '🍓', '🦄'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff7fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stickersOnCanvas.forEach(({ x, y, sticker }) => {
      ctx.font = '40px serif';
      ctx.fillText(sticker, x, y);
    });
  }, [stickersOnCanvas]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing || selectedSticker) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = selectedColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  const placeSticker = (e) => {
    if (!selectedSticker) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStickersOnCanvas([...stickersOnCanvas, { x, y, sticker: selectedSticker }]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff7fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStickersOnCanvas([]);
  };

  return (
    <div style={coloringStyles.wrapper}>
      <h1 style={coloringStyles.title}>🎀 Color & Heal 🎨</h1>

      <div style={coloringStyles.container}>
        {/* LEFT - Canvas */}
        <div style={coloringStyles.canvasBox}>
          <canvas
            ref={canvasRef}
            width={420}
            height={360}
            style={coloringStyles.canvas}
            onMouseDown={selectedSticker ? placeSticker : startDrawing}
            onMouseMove={selectedSticker ? undefined : draw}
            onMouseUp={selectedSticker ? undefined : stopDrawing}
            onMouseLeave={selectedSticker ? undefined : stopDrawing}
          />
        </div>

        {/* RIGHT - Tools */}
        <div style={coloringStyles.toolsBox}>
          {/* Colors */}
          <div>
            <h3 style={coloringStyles.toolTitle}>🎨 Color Palette</h3>
            <div style={coloringStyles.colorGrid}>
              {colorPalette.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    ...coloringStyles.colorBtn,
                    backgroundColor: color,
                    border: selectedColor === color ? '3px solid #6A3EA1' : '2px solid #fff',
                    boxShadow: selectedColor === color ? '0 0 8px #6A3EA1' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Brush size */}
          <div>
            <label style={coloringStyles.toolTitle}>
              Brush Size: {brushSize}
              <input
                type="range"
                min="5"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                style={coloringStyles.slider}
              />
            </label>
          </div>

          {/* Stickers */}
          <div>
            <h3 style={coloringStyles.toolTitle}>🌟 Stickers</h3>
            <div style={coloringStyles.stickerGrid}>
              {stickers.map(stk => (
                <button
                  key={stk}
                  onClick={() => setSelectedSticker(stk)}
                  style={{
                    ...coloringStyles.stickerBtn,
                    background: selectedSticker === stk ? '#F8DFFF' : 'transparent',
                    border: selectedSticker === stk ? '2px solid #6A3EA1' : '2px solid transparent',
                  }}
                >
                  {stk}
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedSticker(null)} style={coloringStyles.clearStickerBtn}>
              Clear Sticker Mode
            </button>
          </div>

          {/* Clear Canvas */}
          <button onClick={clearCanvas} style={coloringStyles.clearBtn}>
            Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== MAIN STYLES ==================== */
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ffeef8 0%, #e8d5f2 100%)',
    padding: '40px 20px',
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  mainTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#9b59b6',
    marginBottom: '10px',
  },
  titleAccent: {
    color: '#ef6ac3ff',
  },
  subtitle: {
    fontSize: '18px',
    color: '#7d5ba6',
  },
  homeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 5px 20px rgba(155, 89, 182, 0.15)',
  },
  cardIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#9b59b6',
    marginBottom: '10px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#7d5ba6',
  },
  pageContent: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  backBtn: {
    background: '#e91e63',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)',
  },
};

/* ==================== MEMORY GAME STYLES ==================== */
const memoryStyles = {
  gameCard: {
    background: 'white',
    borderRadius: '25px',
    padding: '30px',
    boxShadow: '0 8px 30px rgba(155, 89, 182, 0.18)',
    maxWidth: '480px',   // smaller width
    margin: '0 auto',
  },

  title: {
    textAlign: 'center',
    fontSize: '32px',   // smaller title
    fontWeight: '700',
    color: '#9b59b6',
    marginBottom: '8px',
  },

  subtitle: {
    textAlign: 'center',
    fontSize: '14px',   // slightly smaller
    color: '#7d5ba6',
    marginBottom: '25px',
  },

  statsBar: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '25px',
  },

  statBox: {
    background: 'linear-gradient(135deg, #f8e4f8 0%, #e8d5f2 100%)',
    padding: '12px 20px',   // reduced padding
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },

  statLabel: {
    fontSize: '12px',
    color: '#7d5ba6',
    fontWeight: '500',
  },

  statValue: {
    fontSize: '18px',
    color: '#9b59b6',
    fontWeight: '700',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px', // smaller gap
    marginBottom: '25px',
  },

  card: {
    aspectRatio: '1',
    background: 'linear-gradient(135deg, #ffd6e8 0%, #c7b5ff 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 3px 12px rgba(155, 89, 182, 0.18)',
    border: '2px solid transparent',
  },

  cardFlipped: {
    background: 'white',
    border: '2px solid #ffb7d5',
    transform: 'scale(1.04)',
  },

  cardEmoji: {
    fontSize: '38px', // smaller emoji
  },

  cardBack: {
    fontSize: '28px',
    color: 'white',
    fontWeight: '700',
  },

  resetBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #e91e63 0%, #9b59b6 100%)',
    color: 'white',
    border: 'none',
    padding: '12px',  // smaller button
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(233, 30, 99, 0.28)',
  },

  winModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(155, 89, 182, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  winContent: {
    background: 'white',
    padding: '40px',  // smaller modal
    borderRadius: '25px',
    textAlign: 'center',
    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.25)',
  },

  winTitle: {
    fontSize: '30px',
    color: '#9b59b6',
    marginBottom: '15px',
  },

  winText: {
    fontSize: '16px',
    color: '#7d5ba6',
    marginBottom: '25px',
  },

  winBtn: {
    background: 'linear-gradient(135deg, #e91e63 0%, #9b59b6 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '22px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(233, 30, 99, 0.28)',
  },
};

/* ==================== COLORING GAME STYLES ==================== */
const coloringStyles = {
  wrapper: {
    background: 'white',
    borderRadius: '30px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(155, 89, 182, 0.2)',
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    color: '#6A3EA1',
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '30px',
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    gap: '30px',
  },
  canvasBox: {
    flex: 1,
    background: '#f8f4fc',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    borderRadius: '15px',
    border: '3px solid #F8DFFF',
    cursor: 'crosshair',
  },
  toolsBox: {
    width: '280px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  toolTitle: {
    color: '#6A3EA1',
    marginBottom: '10px',
    fontWeight: '600',
    fontSize: '16px',
  },
  colorGrid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  colorBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  slider: {
    width: '100%',
    marginTop: '8px',
  },
  stickerGrid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  stickerBtn: {
    fontSize: '28px',
    borderRadius: '12px',
    cursor: 'pointer',
    padding: '6px 10px',
    transition: 'all 0.3s ease',
  },
  clearStickerBtn: {
    background: '#6A3EA1',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    width: '100%',
  },
  clearBtn: {
    background: 'linear-gradient(135deg, #FFB7C5, #FF9FB0)',
    border: 'none',
    borderRadius: '20px',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    padding: '12px 0',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(255, 183, 197, 0.6)',
    transition: 'transform 0.2s ease',
  },
};