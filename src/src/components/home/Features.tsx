
import { useState, useEffect, useRef } from 'react';
import { 
  Map, 
  Package2, 
  Users, 
  Search, 
  DatabaseZap,
  ShieldCheck
} from 'lucide-react';

const features = [
  {
    icon: <Package2 className="h-8 w-8 text-blue-400" />,
    title: "Inventory Management",
    description: "Track all your products with detailed information, stock levels, and movement history."
  },
  {
    icon: <Map className="h-8 w-8 text-blue-400" />,
    title: "Geolocation Maps",
    description: "Visualize where your inventory is located with interactive maps and location tracking."
  },
  {
    icon: <Users className="h-8 w-8 text-blue-400" />,
    title: "Multi-tenant Architecture",
    description: "Securely isolate data between organizations while maintaining a unified platform."
  },
  {
    icon: <Search className="h-8 w-8 text-blue-400" />,
    title: "Advanced Search",
    description: "Find products quickly with powerful search capabilities across all inventory data."
  },
  {
    icon: <DatabaseZap className="h-8 w-8 text-blue-400" />,
    title: "Real-time Updates",
    description: "See inventory changes immediately with live updates and synchronization."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-blue-400" />,
    title: "Secure Access Control",
    description: "Define permissions and access levels for different users and organizations."
  }
];

const Features = () => {
  const [isVisible, setIsVisible] = useState<boolean[]>(Array(features.length).fill(false));
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observers = featuresRef.current.map((ref, index) => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
          observer.disconnect();
        }
      }, observerOptions);

      if (ref) observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <section id="features" className="py-24 bg-[#0a1218] relative overflow-hidden">
      {/* Background elements with reduced opacity */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#0f1923] to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0f1923] to-transparent"></div>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(23,74,119,0.15)_0%,transparent_100%)]" />
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-500/3 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-blue-500/3 rounded-full filter blur-3xl opacity-50"></div>
      </div>

      <div className="container px-4 md:px-6">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/5 px-3 py-1 text-sm mb-4">
            <span className="font-medium text-blue-400">Powerful Features</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
            Everything you need to manage your inventory
          </h2>
          <p className="text-xl text-gray-300">
            Our platform combines powerful inventory management with precise geolocation capabilities.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              ref={el => featuresRef.current[index] = el}
              className={`bg-[#0d1c28] rounded-xl border border-blue-400/10 p-6 transition-all duration-700 ${
                isVisible[index] 
                  ? 'opacity-100 transform-none' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Feature highlight */}
        <div 
          className="mt-20 bg-gradient-to-b from-[#0d1c28] to-[#0a1218] border border-blue-400/10 rounded-xl overflow-hidden shadow-sm relative"
        >
          <div className="p-8 md:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/5 px-3 py-1 text-sm mb-4">
                <span className="font-medium text-blue-400">Spotlight Feature</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Advanced Geolocation</h3>
              <p className="text-lg text-gray-300 mb-6">
                Our intuitive interface lets you view your inventory list while simultaneously 
                seeing where items are located on a map. Click any item to see detailed information
                and its precise location.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center">
                  <Map className="mr-2 h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Interactive Maps</span>
                </div>
                <div className="flex items-center">
                  <Package2 className="mr-2 h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Item Details</span>
                </div>
                <div className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-blue-400" />
                  <span className="text-gray-300">Search Capabilities</span>
                </div>
              </div>
            </div>
          </div>
          <div className="aspect-[16/9] md:absolute md:right-0 md:top-0 md:w-1/2 md:h-full bg-[#0a1218]/50 border-t md:border-t-0 md:border-l border-blue-400/10 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="p-4 relative">
                <div className="bg-[rgba(13,28,40,0.7)] backdrop-blur-sm p-4 rounded-md animate-float border border-blue-300/10">
                  <div className="h-4 w-32 bg-blue-400/20 rounded mb-2"></div>
                  <div className="h-3 w-48 bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 w-40 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
