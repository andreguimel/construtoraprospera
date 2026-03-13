import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/prospera-logo.png";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Imóveis", href: "/imoveis" },
  { label: "Serviços", href: "/servicos" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#152b47]/95 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-18 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Prospera" className="h-12 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-accent ${
                scrolled ? "text-foreground" : "text-primary-foreground/90"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/contato" className="btn-gold text-sm px-5 py-2.5">
            Fale Conosco
          </Link>
        </nav>

        <button
          className={`md:hidden transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-lg border-b border-border">
          <nav className="flex flex-col px-4 py-4 gap-3">
            {navItems.map((item) => (
              <Link key={item.label} to={item.href} className="nav-link py-2" onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link to="/contato" className="btn-gold text-sm text-center mt-2" onClick={() => setIsOpen(false)}>
              Fale Conosco
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
