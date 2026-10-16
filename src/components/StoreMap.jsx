import { useEffect, useRef } from 'react';

export default function StoreMap({ compact = false }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.L) return;
    const map = window.L.map(ref.current).setView([-33.0245, -71.5518], 15);
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    window.L.marker([-33.0245, -71.5518]).addTo(map).bindPopup('<b>Nexus Gaming Store</b><br>Sucursal Viña del Mar.').openPopup();
    return () => map.remove();
  }, []);
  return <div className={`store-map ${compact ? 'compact-map' : ''}`} ref={ref} />;
}
