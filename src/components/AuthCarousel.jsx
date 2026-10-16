import { useEffect, useState } from 'react';

const slides = ['fondo1.jpg','fondo2.jpg','fondo3.jpg','fondo4.jpg'];

export default function AuthCarousel() {
  const [current, setCurrent] = useState(0);
  useEffect(() => { const id = setInterval(() => setCurrent(v => (v + 1) % slides.length), 60000); return () => clearInterval(id); }, []);
  return <>
    <div className="carousel-bg">{slides.map((file, i) => <div key={file} className={`slide ${i === current ? 'active' : ''}`} 
         style={{ backgroundImage: `url(/assets/${file})` }} />)}</div>
    <div className="overlay" />
  </>;
}
