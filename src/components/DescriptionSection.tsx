import Link from "next/link";

export default function DescriptionSection() {
  return (
    <section className="bg-black px-6 py-32">
      <div className="mx-auto max-w-3xl space-y-20">
        <p className="text-xl sm:text-2xl leading-relaxed text-gray-300">
          Your video library holds thousands of stories. Finding them shouldn&apos;t
          require uploading everything to the cloud.
        </p>
        <p className="text-xl sm:text-2xl leading-relaxed text-gray-300">
          xappio.AI transforms local ingest into narrative understanding —
          conversational search across your entire video library, before editing
          begins.
        </p>
        <p className="text-xl sm:text-2xl leading-relaxed text-gray-300">
          Ask questions in plain language. xappio searches transcripts, visual
          content, and metadata to surface the moments that matter. Everything
          runs locally, on your hardware.
        </p>
        <div className="pt-8">
          <Link
            href="/join-beta"
            className="text-gray-500 hover:text-white transition-colors text-lg"
          >
            Join the beta &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
