import HeroSection from "@/components/HeroSection";
import IsometricUI from "@/components/IsometricUI";
import DescriptionSection from "@/components/DescriptionSection";
import TranscriptUI from "@/components/TranscriptUI";
import IdeationUI from "@/components/IdeationUI";
import MediaBrowserUI from "@/components/MediaBrowserUI";
import VideoPlaceholder from "@/components/VideoPlaceholder";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IsometricUI />
      <DescriptionSection />
      <TranscriptUI />
      <IdeationUI />
      <MediaBrowserUI />
      <VideoPlaceholder />
    </main>
  );
}
