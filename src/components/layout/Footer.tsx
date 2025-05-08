import Link from 'next/link';
import { Mail, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 bg-[#2a3e8c] px-4 pb-6 pt-12 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        {/* Logo e slogan */}
        <div className="mb-8 flex-1 md:mb-0">
          <Link href="/" className="mb-2 flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white">Futuro</span>
            <span className="text-2xl font-extrabold text-green-400">
              Tesoro
            </span>
          </Link>
          <p className="mt-2 max-w-xs text-sm text-gray-300">
            Il modo più semplice e sicuro per regalare un futuro migliore ai
            bambini che ami.
          </p>
        </div>
        {/* Menu navigazione */}
        <div className="mb-8 flex-1 md:mb-0">
          <nav className="flex flex-col gap-2">
            <Link
              href="/#come-funziona"
              className="transition hover:text-green-300"
            >
              Come Funziona
            </Link>
            <Link href="/#vantaggi" className="transition hover:text-green-300">
              Vantaggi
            </Link>
            <Link
              href="/#simulatore"
              className="transition hover:text-green-300"
            >
              Simulatore
            </Link>
            <Link
              href="/auth/register"
              className="transition hover:text-green-300"
            >
              Crea un Regalo
            </Link>
          </nav>
        </div>
        {/* Link legali e contatti */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="mb-2 flex gap-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-300 hover:text-green-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/termini"
              className="text-sm text-gray-300 hover:text-green-300"
            >
              Termini
            </Link>
          </div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-300">
            <Mail className="h-4 w-4" />
            <a
              href="mailto:info@futurotesoro.it"
              className="hover:text-green-300"
            >
              info@futurotesoro.it
            </a>
          </div>
          <div className="mt-2 flex gap-3">
            <a href="#" aria-label="Instagram" className="hover:text-green-300">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-green-300">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Futuro Tesoro. Tutti i diritti riservati.
      </div>
    </footer>
  );
}
