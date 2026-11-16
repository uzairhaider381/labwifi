import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturesGrid } from './components/FeaturesGrid';
import { InteractiveWebDemo } from './components/InteractiveWebDemo';
import { ArchitectureSection } from './components/ArchitectureSection';
import { DownloadSection } from './components/DownloadSection';
import { DocumentationSection } from './components/DocumentationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar onNavigate={scrollToSection} />
      <main className="flex-1">
        <HeroSection onNavigate={scrollToSection} />
        <FeaturesGrid />
        <InteractiveWebDemo />
        <ArchitectureSection />
        <DownloadSection />
        <DocumentationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};
