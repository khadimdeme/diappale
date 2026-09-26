import Link from "next/link";

export const metadata = {
  title: "Confidentialité — Diapalé",
};

export default function ConfidentialitePage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10">
      <Link href="/" className="text-sm font-bold text-muted">
        ← Retour
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold">
        Politique de confidentialité
      </h1>
      <p className="mt-1 text-sm text-muted">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}</p>

      <div className="mt-6 grid gap-6 text-sm leading-relaxed text-text">
        <section>
          <h2 className="font-display text-lg font-bold">
            Quelles données on récolte
          </h2>
          <p className="mt-1.5 text-muted">
            Selon que tu crées un compte candidat ou recruteur : ton nom, ton
            numéro de téléphone (pour le contact WhatsApp), ta ville, ton
            métier ou le nom de ton entreprise, et si tu choisis de les
            ajouter, ton CV, tes photos de réalisations et tes expériences.
            On ne demande jamais de numéro de carte bancaire ou de pièce
            d&apos;identité scannée.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Pourquoi</h2>
          <p className="mt-1.5 text-muted">
            Uniquement pour faire fonctionner la mise en relation : afficher
            ton profil à un recruteur quand tu postules, ou afficher une
            offre aux candidats qui la consultent. On ne vend et on ne
            partage jamais tes données avec des tiers à des fins publicitaires.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Où c&apos;est stocké</h2>
          <p className="mt-1.5 text-muted">
            Tes données sont hébergées chez Supabase, un service
            d&apos;hébergement sécurisé. L&apos;accès à ton profil complet est
            limité : un recruteur ne peut voir ton profil que si tu as
            postulé ou consulté une de ses offres — jamais en fouillant
            librement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Cookies</h2>
          <p className="mt-1.5 text-muted">
            Diapalé utilise uniquement un cookie technique nécessaire pour te
            garder connecté. Pas de cookie publicitaire, pas de traceur tiers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-bold">Tes droits</h2>
          <p className="mt-1.5 text-muted">
            Tu peux à tout moment modifier ton profil, supprimer ton CV ou tes
            photos depuis ton espace. Pour supprimer ton compte entièrement ou
            pour toute question sur tes données, écris-nous à{" "}
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
