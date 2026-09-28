import Reveal from '../components/Reveal'

export default function About() {
  return (
    <main>
      <section className="page-hero wrap">
        <p className="eyebrow">Qui je suis</p>
        <h1 className="anton">
          Mon <span className="rose">parcours</span>
        </h1>
        <p>
          Étudiante en informatique, fondatrice d'agence, et attachée à faire aussi bien tourner
          le code que porter une identité visuelle.
        </p>
      </section>

      <Reveal as="section" className="about-block wrap">
        <h2>Formation</h2>
        <p>
          Actuellement en Licence 3 informatique, avec une pratique du développement construite
          sur PHP, Java, Laravel et JavaScript — approfondie à travers des projets personnels
          plutôt que la seule théorie de cours.
        </p>
      </Reveal>

      <Reveal as="section" className="about-block wrap">
        <h2>Athar</h2>
        <p>
          J'ai fondé Athar, une agence digitale lancée à Bouaké avec l'ambition de s'étendre à
          l'échelle nationale. C'est là que je fais converger mes deux compétences : construire
          des sites qui fonctionnent, et les habiller d'une identité qui se retient.
        </p>
      </Reveal>

      <Reveal as="section" className="about-block wrap">
        <h2>Compétences techniques</h2>
        <div className="interests-row">
          <span className="pill">React</span>
          <span className="pill">JavaScript</span>
          <span className="pill">PHP / Laravel</span>
          <span className="pill">Java</span>
          <span className="pill">Supabase</span>
          <span className="pill">MySQL</span>
          <span className="pill">Identité visuelle</span>
          <span className="pill">Composition</span>
        </div>
      </Reveal>

      <Reveal as="section" className="about-block wrap">
        <h2>En dehors du code</h2>
        <p>
          Section à compléter — dis-moi ce que tu veux vraiment mettre ici (dessin, lecture,
          autre chose) et je remplace ce texte par le tien depuis l'admin.
        </p>
      </Reveal>
    </main>
  )
}
