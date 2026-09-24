"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-bg"
    >
      📄 Enregistrer en PDF
    </button>
  );
}
