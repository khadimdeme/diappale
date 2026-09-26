import Link from "next/link";

export const metadata = {
  title: "Conditions d'utilisation — Diapalé",
};

export default function CguPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10">
      <Link href="/" className="text-sm font-bold text-muted">
        ← Retour
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold">
        Conditions générales d&apos;utilisation
      </h1>
      <p className="mt-1 text-sm text-muted">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}</p>

      <div className="mt-6 grid gap-6 text-sm leading-relaxed text-text">
        <section>
          <h2 className="font-display text-lg font-bold">Ce qu&apos;est Diapalé</h2>
          <p className="mt-1.5 text-muted">
            Diapalé est une plateforme qui met en relation des candidats et
            des recruteurs au Sénégal. Créer un profil candidat et publier une
            offre sont gratuits. Diapalé n&apos;est pas partie au contrat de
            travail éventuel entre un candidat et un recruteur — on facilite
            uniquement la mise en contact.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Règles pour les recruteurs</h2>
          <p className="mt-1.5 text-muted">
            Une offre publiée doit correspondre à un poste réellement
            disponible. La consultation libre des profils candidats sans
            offre publiée n&apos;est pas autorisée — c&apos;est une règle
            technique du site, pas seulement une condition d&apos;usage.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Règles pour les candidats</h2>
          <p className="mt-1.5 text-muted">
            Les informations de ton profil (métier, expérience, coordonnées)
            doivent être exactes. Une candidature engage ta responsabilité vis
            à vis du recruteur que tu contactes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Suspension de compte</h2>
          <p className="mt-1.5 text-muted">
            Un compte utilisé pour publier de fausses offres, harceler un
            autre utilisateur ou contourner les règles de la plateforme peut
            être suspendu sans préavis.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Contact</h2>
          <p className="mt-1.5 text-muted">
            Une question sur ces conditions ? Écris-nous à{" "}
            <a href="mailto:contact@diapale.sn" className="font-bold text-ink underline">
              contact@diapale.sn
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
