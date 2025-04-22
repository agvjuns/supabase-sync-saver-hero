
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const CTA = () => {
  return (
    <section id="contact" className="py-24 relative bg-[#0a1218]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f1923]/60" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="bg-gradient-to-r from-blue-900/80 to-blue-600/80 rounded-2xl overflow-hidden shadow-xl relative">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,transparent)]" />
          <div className="relative z-10 px-6 py-12 sm:px-12 lg:px-16 lg:py-14">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to transform your inventory management?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-lg mx-auto">
                Join thousands of businesses that use GeoInventory to track and manage their assets with precision.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-white/90 btn-glow text-white"
                >
                  <Link to="/signup">
                    Start your free trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  <Link to="/demo">
                    Request a demo
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-center text-sm font-medium text-gray-400 mb-8 uppercase tracking-wider">
            Trusted by innovative companies
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-32 bg-gray-800/30 rounded-md flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 max-w-lg mx-auto p-6 bg-[rgba(13,28,40,0.7)] backdrop-blur-sm rounded-xl border border-blue-300/10">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="italic text-gray-300 mb-2">
                  "GeoInventory has completely transformed how we manage our warehouse operations. The geolocation features have saved us countless hours."
                </p>
                <p className="font-medium text-white">Sarah Johnson</p>
                <p className="text-sm text-gray-400">Operations Manager at TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
