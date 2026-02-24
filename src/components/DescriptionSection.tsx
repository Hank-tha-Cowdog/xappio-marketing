import Link from "next/link";

export default function DescriptionSection() {
  return (
    <section className="bg-black px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <p className="text-xl sm:text-2xl leading-relaxed text-gray-300 text-center">
          Local conversational search across your entire video library — ask questions in plain language, on your own hardware.
        </p>
        <div className="pt-12 text-center">
          <Link
            href="/join-beta"
            className="text-amber-500 hover:text-amber-400 transition-colors text-lg"
          >
            Join the beta &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
