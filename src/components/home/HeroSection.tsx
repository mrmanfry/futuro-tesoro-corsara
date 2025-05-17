import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift } from 'lucide-react';
// import TextSwap from '../common/TextSwap';

const HeroSection = () => {
  return (
    <section className="overflow-hidden pb-16 pt-24 md:pb-24 md:pt-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center lg:flex-row">
          <div className="mb-10 lg:mb-0 lg:w-1/2 lg:pr-16">
            <h1 className="mb-6 font-sans text-6xl font-bold leading-none md:text-6xl lg:text-6xl">
              Un regalo che{' '}
              <span className="bg-gradient-to-r from-[#3B82F6] via-[#10B981] to-[#F59E0B] bg-clip-text text-transparent">
                cresce
              </span>{' '}
              con loro
            </h1>
            <p className="mb-8 text-base text-gray-600 md:text-lg">
              Crea un regalo per chi ami di più, invita amici e parenti con un
              link, raccogli i contributi e investi nel suo futuro
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full border-0 px-8 text-base font-semibold shadow-md"
                style={{ background: '#2b6eff', color: '#fff' }}
              >
                <Link href="/create-gift" className="flex items-center gap-2">
                  Crea un Regalo
                  <ArrowRight
                    size={16}
                    className="transform transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border px-8 text-base font-semibold"
                style={{
                  borderColor: '#2b6eff',
                  color: '#2b6eff',
                  background: '#fff',
                }}
              >
                <Link href="/come-funziona">Scopri Come Funziona</Link>
              </Button>
            </div>
          </div>
          <div className="relative lg:w-1/2">
            <div
              className="relative overflow-hidden rounded-3xl p-8"
              style={{
                background: 'linear-gradient(135deg, #d2f4f9 0%, #c7e0fa 100%)',
              }}
            >
              <div className="relative mb-8 animate-float rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: '#e3f1fb' }}
                  >
                    <Gift className="" size={18} style={{ color: '#0090ff' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">
                      Regalo per Sofia
                    </h3>
                    <p className="text-sm text-gray-600">
                      Battesimo - 12 Maggio 2024
                    </p>
                  </div>
                </div>
                <div
                  className="space-y-2 rounded-lg p-4"
                  style={{ background: '#f6fbfe' }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Totale raccolta:</span>
                    <span className="font-medium" style={{ color: '#0090ff' }}>
                      1000€
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-right text-sm">
                    <span className="text-gray-600">Hanno contribuito:</span>
                    <span className="text-right text-gray-600">
                      14 amici e parenti
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="relative ml-auto w-5/6 animate-float rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-sm"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-base font-semibold">
                    Proiezione a 18 anni
                  </h3>
                </div>
                <div
                  className="mb-2 rounded-lg p-3"
                  style={{ background: '#eafcf7' }}
                >
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">
                      Investimento iniziale:
                    </span>
                    <span className="font-medium text-black">1000€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valore stimato:</span>
                    <span className="font-medium" style={{ color: '#19c37d' }}>
                      1694€
                    </span>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-600">
                  Basato su un rendimento medio del 5,5% annuo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
