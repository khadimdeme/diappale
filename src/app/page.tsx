import Link from "next/link";

const secteurs = [
  "🧵 Couture",
  "🚗 Transport",
  "🏗️ Bâtiment",
  "💻 Tech",
  "🍽️ Restauration",
  "🧹 Ménage & domicile",
  "🛒 Vente & commerce",
];

const etapes = [
  {
    num: "01",
    titre: "On crée un profil en 5 min",
    texte:
      "Email + mot de passe (gratuit), numéro de téléphone ajouté ensuite pour le contact WhatsApp — le CV se génère tout seul, avec ou sans photos de réalisations.",
  },
  {
    num: "02",
    titre: "Le recruteur publie, le candidat postule",
    texte:
      "Le recruteur doit publier une annonce pour recevoir des candidats — pas de fouille gratuite dans les profils. Le candidat, lui, filtre et postule librement.",
  },
  {
    num: "03",
    titre: "Alerte, puis contact direct",
    texte:
      "Dès qu'un candidat postule ou consulte l'offre, le recruteur est alerté et voit son profil complet — WhatsApp ou email, tout de suite.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5">
      {/* NAV */}
      <div className="pt-4">
        <div className="flex items-center justify-between rounded-full border border-border bg-surface px-4 py-2.5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-[9px] bg-ink-2 font-display text-base font-bold text-white">
              D
            </div>
            <span className="font-display text-lg font-bold">Diapalé</span>
          </div>
          <div className="flex gap-3 text-sm font-bold">
            <Link
              href="/compte?mode=login"
              className="rounded-full px-3 py-1.5 text-muted hover:text-text"
            >
              Se connecter
            </Link>
            <Link
              href="/compte"
              className="rounded-full bg-ink px-4 py-1.5 text-bg"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section
        className="mt-5 overflow-hidden rounded-[28px] px-6 py-11 md:px-9"
        style={{ background: "#F2B33D", color: "#20160A" }}
      >
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/55 px-3.5 py-1.5 text-xs font-extrabold tracking-wide uppercase">
          <span className="size-1.5 rounded-full bg-[#20160A]" /> Le Sénégal
          qui travaille
        </span>
        <h1 className="mt-4 max-w-[12ch] font-display text-4xl leading-[1.02] font-black tracking-tight md:text-6xl">
          Trouve ta place. Recrute la bonne personne.
        </h1>
        <p className="mt-4 max-w-[44ch] text-base text-[#3A2A10] md:text-lg">
          Diapalé connecte le Sénégal qui travaille — du poste en entreprise
          au métier du quartier — avec des profils complets, un contact
          direct par WhatsApp ou email, et une interface pensée pour la 3G.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["📄 Profil en 5 min", "💬 Contact direct", "⭐ Visibilité boostée"].map(
            (chip) => (
              <span
                key={chip}
                className="rounded-full border border-black/10 bg-white/60 px-3.5 py-1.5 text-xs font-bold"
              >
                {chip}
              </span>
            )
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/compte?role=candidat"
            className="rounded-full bg-[#20160A] px-5 py-3.5 text-sm font-extrabold text-[#FCEFD6]"
          >
            Je cherche un emploi
          </Link>
          <Link
            href="/compte?role=recruteur"
            className="rounded-full bg-white px-5 py-3.5 text-sm font-extrabold text-[#20160A]"
          >
            Je recrute
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-7 border-t border-black/15 pt-4">
          <div>
            <b className="block font-display text-xl font-extrabold">Gratuit</b>
            <span className="text-xs text-[#4A3712]">
              pour créer un profil ou publier
            </span>
          </div>
          <div>
            <b className="block font-display text-xl font-extrabold">
              Dakar · Thiès · Touba
            </b>
            <span className="text-xs text-[#4A3712]">+ 8 régions couvertes</span>
          </div>
        </div>
      </section>

      {/* SECTEURS */}
      <div className="mt-9">
        <p className="text-xs font-extrabold tracking-wide text-bloom uppercase">
          Représenté sur la plateforme
        </p>
        <h2 className="mt-1 text-base font-bold text-muted">
          Des secteurs formels et informels, sans hiérarchie
        </h2>
      </div>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {secteurs.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-bold"
          >
            {s}
          </span>
        ))}
      </div>

      {/* COMMENT ÇA MARCHE */}
      <div className="mt-13">
        <p className="text-xs font-extrabold tracking-wide text-bloom uppercase">
          Comment ça marche
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">
          Trois étapes, sans jargon
        </h2>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {etapes.map((e) => (
          <div
            key={e.num}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div className="font-display text-2xl font-extrabold text-gold-deep">
              {e.num}
            </div>
            <h4 className="mt-2.5 text-[15.5px] font-extrabold">{e.titre}</h4>
            <p className="mt-1.5 text-[13.5px] text-muted">{e.texte}</p>
          </div>
        ))}
      </div>

      {/* CTA FINAL */}
      <div className="my-14 rounded-2xl border border-border bg-surface p-8 text-center">
        <h3 className="font-display text-2xl font-bold">
          Prêt à commencer ?
        </h3>
        <p className="mt-2 text-muted">
          Gratuit, sans engagement, en 5 minutes.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/compte?role=candidat"
            className="rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-bg"
          >
            Je cherche un emploi
          </Link>
          <Link
            href="/compte?role=recruteur"
            className="rounded-full border border-border px-5 py-3 text-sm font-extrabold"
          >
            Je recrute
          </Link>
        </div>
      </div>

      <footer className="mb-8 flex flex-wrap justify-between gap-3 border-t border-border pt-5 text-xs text-muted">
        <span>Diapalé — plateforme de recrutement pour le Sénégal.</span>
        <span>🇸🇳</span>
      </footer>
    </main>
  );
}
