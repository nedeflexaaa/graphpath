import cityImage from '../assets/images/city-routes.jpg';
import serverImage from '../assets/images/server-room.jpg';
import warehouseImage from '../assets/images/warehouse.jpg';

const APPLICATIONS = [
  {
    image: cityImage,
    width: 900,
    height: 554,
    alt: 'Аерофотознімок щільної міської забудови',
    title: 'Міська навігація',
    text: 'Пошук найшвидшого маршруту між точками на карті: вершини — перехрестя, ребра — дороги, ваги — час у дорозі.',
    credit: 'Фото: Unsplash',
  },
  {
    image: serverImage,
    width: 900,
    height: 505,
    alt: 'Серверні шафи з комутаційними кабелями',
    title: 'Мережева маршрутизація',
    text: 'Вибір шляху пакетів між вузлами мережі. Ваги ребер можуть описувати затримку, вартість каналу або навантаження.',
    credit: 'Фото: Unsplash',
  },
  {
    image: warehouseImage,
    width: 900,
    height: 600,
    alt: 'Великий склад із стелажами та коробками',
    title: 'Логістика',
    text: 'Планування доставки, об’їзду точок і завантаження транспорту. Граф допомагає порівнювати варіанти маршрутів.',
    credit: 'Фото: Unsplash',
  },
];

export default function ApplicationsSection() {
  return (
    <section className="section section--alt" id="applications">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Контекст</p>
            <h2>Графи навколо нас</h2>
          </div>
          <p className="section-head__note">
            Ті самі алгоритми стоять за навігацією, мережами та логістикою. У демо
            вони зменшені до навчальних прикладів, але логіка залишається тією ж.
          </p>
        </div>

        <div className="applications-grid">
          {APPLICATIONS.map((application) => (
            <figure className="application-card" key={application.title}>
              <img
                src={application.image}
                alt={application.alt}
                width={application.width}
                height={application.height}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <h3>{application.title}</h3>
                <p>{application.text}</p>
                <small>{application.credit}</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
