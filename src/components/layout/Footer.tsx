
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="font-semibold text-xl">GeoInventory</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              A powerful inventory management system with geolocation capabilities.
              Track your assets with precision and ease.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-foreground/80 hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-foreground/80 hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-foreground/80 hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-foreground/80 hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-foreground/80 hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} GeoInventory. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
