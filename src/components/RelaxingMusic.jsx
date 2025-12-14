import { Heart, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function RelaxingMusic() {
  const [playingSound, setPlayingSound] = useState(null);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const audioRef = useRef(null);

  const soundCategories = [
    {
      name: 'Nature Sounds',
      sounds: [
        { id: 1, name: 'Rain', emoji: '🌧️', description: 'Gentle rain sounds', duration: '30:00', src: '/src/Public/Rain.mp3.mp3' },
        { id: 2, name: 'Ocean Waves', emoji: '🌊', description: 'Calming ocean waves', duration: '45:00', src: '/src/Public/ocean.mp3' },
         { id: 3, name: 'Bird', emoji: '🐦', description: 'Soothing morning bird chirps', duration: '30:00', src: '/src/Public/bird.mp3' }
      ]
    },
    {
      name: 'Ambient & Meditation',
      sounds: [
        { id: 4, name: 'Tibetan Bowls', emoji: '🎵', description: 'Healing singing bowl vibrations', duration: '25:00', src: '/src/Public/tibetainbowl.mp3.mp3' },
        { id: 5, name: 'Wind Chimes', emoji: '🎐', description: 'Gentle wind chimes melody', duration: '35:00', src: '/src/Public/wind-chimes.mp3.mp3' },
        { id: 6, name: 'Meditation', emoji: '🧘', description: 'Calm and deep meditation ambience', duration: '35:00', src: '/src/Public/meditation.mp3' }
      ]
    },
    {
      name: 'Cozy & Comfort',
      sounds: [
        { id: 7, name: 'Fireplace', emoji: '🔥', description: 'Crackling fireplace warmth', duration: '60:00', src: '/src/Public/fire.mp3' },
        { id: 8, name: 'Coffee Shop', emoji: '☕', description: 'Ambient cafe atmosphere', duration: '45:00', src: '/src/Public/coffee.mp3' },
        { id: 9, name: 'Night Crickets', emoji: '🦗', description: 'Peaceful cricket sounds at night', duration: '55:00', src: '/src/Public/night.mp3' }
      ]
    }
  ];

  const currentSound = soundCategories
    .flatMap(c => c.sounds)
    .find(s => s.id === playingSound);

  // Play / Pause function
  const togglePlay = (sound) => {
    if (!sound.src) return;

    if (playingSound === sound.id) {
      audioRef.current.pause();
      setPlayingSound(null);
    } else {
      setPlayingSound(sound.id);
    }
  };

  // Play audio whenever currentSound changes
  useEffect(() => {
    if (audioRef.current && currentSound) {
      audioRef.current.play().catch((err) => {
        console.log('Audio play error:', err);
      });
    }
  }, [currentSound]);

  const toggleFavorite = (soundId) => {
    setFavorites(favorites.includes(soundId)
      ? favorites.filter(id => id !== soundId)
      : [...favorites, soundId]
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Update mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7FA', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6A3EA1 0%, #B8B4E3 100%)', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '80px', opacity: '0.2' }}>🎵</div>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '700', margin: '0 0 12px 0' }}>Relaxing Music & Sounds</h1>
          <p style={{ color: '#ACE7FF', fontSize: '18px', margin: 0 }}>Soothing sounds to help you relax, focus, or drift into peaceful sleep</p>
        </div>
      </div>

      {/* Now Playing Bar */}
      {playingSound && (
        <div style={{ background: 'white', padding: '20px', boxShadow: '0 4px 20px rgba(184,180,227,0.2)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
              <button onClick={() => togglePlay(currentSound)} style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFB7C5, #6A3EA1)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Pause size={24} />
              </button>
              <div>
                <div style={{ fontWeight: '600', color: '#333333', marginBottom: '4px' }}>Now Playing</div>
                <div style={{ color: '#6A3EA1', fontSize: '14px' }}>{currentSound?.name}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', minWidth: '250px' }}>
              <button onClick={toggleMute} style={{ background: 'none', border: 'none', color: '#6A3EA1', cursor: 'pointer', padding: '8px' }}>
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} style={{ flex: 1, accentColor: '#FFB7C5' }} />
              <span style={{ color: '#6A3EA1', fontSize: '14px', minWidth: '40px' }}>{volume}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Audio Element */}
      {currentSound?.src && <audio ref={audioRef} src={currentSound.src} loop />}

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        {soundCategories.map((category, catIdx) => (
          <div key={catIdx} style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#6A3EA1', fontSize: '32px', fontWeight: '600', marginBottom: '30px' }}>{category.name}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '24px' }}>
              {category.sounds.map(sound => (
                <div key={sound.id} style={{
                  background: playingSound === sound.id ? 'linear-gradient(135deg,#FFB7C5 0%,#B8B4E3 100%)' : 'white',
                  padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(184,180,227,0.15)',
                  transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative'
                }}>
                  {/* Favorite Button */}
                  <button onClick={() => toggleFavorite(sound.id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                    <Heart size={20} color={favorites.includes(sound.id) ? '#FFB7C5' : '#B8B4E3'} fill={favorites.includes(sound.id) ? '#FFB7C5' : 'none'} />
                  </button>

                  <div style={{ fontSize: '64px', marginBottom: '20px', textAlign: 'center' }}>{sound.emoji}</div>
                  <h3 style={{ fontSize: '22px', fontWeight: '600', color: playingSound === sound.id ? 'white' : '#333', marginBottom: '10px', textAlign: 'center' }}>{sound.name}</h3>
                  <p style={{ color: playingSound === sound.id ? 'rgba(255,255,255,0.9)' : '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '15px', textAlign: 'center' }}>{sound.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <span style={{ color: playingSound === sound.id ? 'rgba(255,255,255,0.8)' : '#999', fontSize: '13px' }}>{sound.duration}</span>
                  </div>

                  <button onClick={() => togglePlay(sound)} style={{
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                    background: playingSound === sound.id ? 'white' : 'linear-gradient(135deg,#FFB7C5,#6A3EA1)',
                    color: playingSound === sound.id ? '#6A3EA1' : 'white', fontWeight: 600, fontSize: '15px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.3s ease'
                  }}>
                    {playingSound === sound.id ? <><Pause size={18} /> Stop</> : <><Play size={18} /> Play</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <h2 style={{ color: '#6A3EA1', fontSize: '32px', fontWeight: '600', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Heart size={32} color="#FFB7C5" fill="#FFB7C5" /> Your Favorites
            </h2>
            <div style={{ background: 'linear-gradient(135deg,#F5EBFF,#FFF7FA)', padding: '30px', borderRadius: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {favorites.map(favId => {
                const sound = soundCategories.flatMap(c => c.sounds).find(s => s.id === favId);
                return (
                  <div key={favId} style={{ background: 'white', padding: '12px 20px', borderRadius: '25px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 10px rgba(184,180,227,0.1)' }}>
                    <span style={{ fontSize: '24px' }}>{sound?.emoji}</span>
                    <span style={{ color: '#333', fontWeight: '500' }}>{sound?.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
