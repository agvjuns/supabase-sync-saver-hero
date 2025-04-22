import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Globe, Package2, Sparkles } from 'lucide-react';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 md:pt-0 bg-gradient-to-b from-[#0a1218] to-[#0f1923]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(23,74,119,0.2)_0%,transparent_100%)]" />
      </div>
      <div className="absolute w-full h-full -z-10">
        <div className="absolute top-1/4 -right-4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{animationDuration: '8s'}} />
        <div className="absolute bottom-1/4 -left-4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{animationDuration: '10s'}} />
      </div>

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center pt-20 pb-24 md:py-24">
        <div 
          className={`inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/5 px-3 py-1 text-sm transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
          }`}
        >
          <Sparkles className="mr-1 h-3.5 w-3.5 text-blue-400" />
          <span className="font-medium text-blue-400">Introducing GeoInventory</span>
          <div className="mx-2 h-4 w-px bg-blue-400/20" />
          <span className="text-muted-foreground">Just launched</span>
        </div>

        <h1 
          className={`mt-6 font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl max-w-3xl transition-all duration-700 delay-100 ease-out text-white ${
            isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
          }`}
        >
          Manage your inventory with <span className="text-blue-400">geolocation precision</span>
        </h1>

        <p 
          className={`mt-6 text-xl text-gray-300 max-w-2xl transition-all duration-700 delay-200 ease-out ${
            isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
          }`}
        >
          Track your assets in real-time, optimize your supply chain, and gain insights into your inventory distribution across locations.
        </p>

        <div 
          className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ease-out ${
            isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto bg-gradient-blue btn-glow text-white"
          >
            <Link to="/signup">
              Get started for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto border-blue-400/20 bg-transparent text-gray-300 hover:bg-blue-500/5"
          >
            <Link to="/#features">
              See features
            </Link>
          </Button>
        </div>

        <div 
          className={`mt-12 inline-flex items-center justify-center rounded-lg border-none bg-[rgba(13,28,40,0.6)] backdrop-blur-sm px-6 py-4 transition-all duration-700 delay-400 ease-out border border-blue-300/10 ${
            isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-blue-400" />
              <span className="text-gray-300">Tenant Isolation</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-blue-400" />
              <span className="text-gray-300">Organization Profiles</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-blue-400" />
              <span className="text-gray-300">Geolocation Maps</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-blue-400" />
              <span className="text-gray-300">Freemium Plan</span>
            </div>
          </div>
        </div>

        <div 
          className={`mt-16 relative w-full max-w-4xl transition-all duration-1000 delay-500 ease-out ${
            isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="aspect-[16/9] overflow-hidden rounded-xl border border-blue-400/10 bg-[rgba(13,28,40,0.4)] shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex w-full h-full items-center justify-center">
                <div className="bg-[rgba(13,28,40,0.7)] backdrop-blur-sm p-6 rounded-xl z-10 mb-8 mx-4 max-w-xl animate-float shadow-lg border border-blue-300/10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-shrink-0 h-14 w-14 bg-gradient-blue rounded-lg flex items-center justify-center">
                      <Package2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-white">Inventory Dashboard</h3>
                      <p className="text-sm text-gray-300">Real-time tracking and management</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-14 w-14 bg-gradient-blue rounded-lg flex items-center justify-center">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-white">Geolocation Maps</h3>
                      <p className="text-sm text-gray-300">Visualize your inventory distribution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-blue-400/10" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
