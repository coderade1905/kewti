import React from 'react'
import Navbar from '../Navbar/Navbar'
import HeroBackground from './HeroBackground'
import HeroSection from './HeroSection'
import Calnder from './Calnder'
import InstallationCard from '../NpmCopy/InstallationCard'
import pointDown from '../../assets/pointDown.svg'
import StatsBanner from '../Banner/StatsBanner'
import Futures from './Futures'
import FeaturesSection from './FeaturesSection'
import TerminalAndCodeView from './TerminalAndCodeView'
import Footer from '../Footer/Footer'
import DevExperience from '../DevExperience/DevExperience'
import ContributorsSection from './ContributorsSection'

async function getWeeklyDownloads(packageName) {
  try {
    const response = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(packageName)}`,
      { next: { revalidate: 3600 } } // Cache data for 1 hour
    );

    if (!response.ok) {
      throw new Error(`npm API error: ${response.status}`);
    }

    const data = await response.json();
    return data.downloads;
  } catch (error) {
    console.error("Failed to fetch downloads:", error);
    return null;
  }
}

export default async function Hero() {
  const downloads = await getWeeklyDownloads("kewti_components");
  const formattedDownloads = downloads 
    ? downloads.toLocaleString() 
    : "10,000+";

  return (
    <>
      <HeroBackground>
        <Navbar />
        <HeroSection />
        <div className='w-4/5 flex items-center justify-center py-20'>
          <Calnder />
        </div>
        <InstallationCard arrowImage={pointDown.src} className="mb-20" />
      </HeroBackground>

      <StatsBanner on={true} />

      <HeroBackground className="min-h-4">
        {/* <div className='w-4/5 flex items-center justify-center py-20'>
          <Futures />
        </div> */}
        <InstallationCard 
          arrowImage={pointDown.src} 
          className="mb-20" 
          text={`Weekly Downloads: ${formattedDownloads}`} 
        />
      </HeroBackground>

      <StatsBanner />

      <HeroBackground>
        <div className='w-full md:w-4/5 flex flex-col md:flex-row px-4 md:px-0'>
          <FeaturesSection />
          <TerminalAndCodeView />
        </div>
      </HeroBackground>

      <StatsBanner />

      <HeroBackground>
        <DevExperience />
      </HeroBackground>

      <StatsBanner />

      <ContributorsSection />

      <StatsBanner />

      <Footer />
    </>
  )
}