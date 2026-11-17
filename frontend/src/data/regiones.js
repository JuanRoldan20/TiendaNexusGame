export const REGIONES = [
  { nombre: 'Región de Arica y Parinacota', comunas: ['Arica', 'Camarones', 'Putre', 'General Lagos'] },
  { nombre: 'Región de Tarapacá', comunas: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica', 'Huara'] },
  { nombre: 'Región de Antofagasta', comunas: ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'Taltal', 'San Pedro de Atacama'] },
  { nombre: 'Región de Atacama', comunas: ['Copiapó', 'Caldera', 'Vallenar', 'Chañaral', 'Diego de Almagro'] },
  { nombre: 'Región de Coquimbo', comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña', 'Los Vilos'] },
  { nombre: 'Región de Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Quillota', 'Los Andes', 'San Felipe'] },
  {
    nombre: 'Región Metropolitana de Santiago',
    comunas: ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'La Florida', 'Maipú', 'Puente Alto', 'San Bernardo', 'Vitacura', 'Lo Barnechea', 'Recoleta', 'Independencia', 'Estación Central', 'Peñalolén', 'Macul', 'La Reina'],
  },
  { nombre: "Región del Libertador General Bernardo O'Higgins", comunas: ['Rancagua', 'Machalí', 'San Fernando', 'Rengo', 'Santa Cruz', 'Pichilemu'] },
  { nombre: 'Región del Maule', comunas: ['Talca', 'Curicó', 'Linares', 'Constitución', 'Cauquenes', 'Molina'] },
  { nombre: 'Región de Ñuble', comunas: ['Chillán', 'Chillán Viejo', 'San Carlos', 'Bulnes', 'Quirihue'] },
  { nombre: 'Región del Biobío', comunas: ['Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante', 'Los Ángeles', 'Coronel', 'Lota', 'Hualpén'] },
  { nombre: 'Región de La Araucanía', comunas: ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol', 'Victoria'] },
  { nombre: 'Región de Los Ríos', comunas: ['Valdivia', 'La Unión', 'Panguipulli', 'Río Bueno', 'Los Lagos'] },
  { nombre: 'Región de Los Lagos', comunas: ['Puerto Montt', 'Osorno', 'Castro', 'Puerto Varas', 'Ancud', 'Frutillar'] },
  { nombre: 'Región de Aysén del General Carlos Ibáñez del Campo', comunas: ['Coyhaique', 'Puerto Aysén', 'Chile Chico', 'Cochrane'] },
  { nombre: 'Región de Magallanes y de la Antártica Chilena', comunas: ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Puerto Williams'] },
];

/** Devuelve las comunas de una región (o [] si no existe). */
export function comunasDe(nombreRegion) {
  return REGIONES.find((r) => r.nombre === nombreRegion)?.comunas ?? [];
}
