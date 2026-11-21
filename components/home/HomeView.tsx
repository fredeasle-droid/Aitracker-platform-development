"use client";

import { useRef } from "react";
import { DesktopHome } from "./DesktopHome";
import { HomeDataProvider, type HomeData } from "./home-data";
import { MobileHome } from "./mobile/MobileHome";

export function HomeView({ data }: { data: HomeData }) {
  const explainerRef = useRef<HTMLVideoElement>(null);
  const playExplainer = () => {
    explainerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    void explainerRef.current?.play();
  };

  return (
    <HomeDataProvider data={data}>
      <div className="bt-theme reference-home overflow-x-clip">
        <div className="md:hidden">
          <MobileHome />
        </div>
        <div className="hidden md:block">
          <DesktopHome playExplainer={playExplainer} explainerRef={explainerRef} />
        </div>
      </div>
    </HomeDataProvider>
  );
}
