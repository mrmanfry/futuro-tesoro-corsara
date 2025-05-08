'use client';

import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function formatCurrency(val: number) {
  return val.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
}

export default function GrowthSimulator() {
  const [investment, setInvestment] = useState(250);
  const [years, setYears] = useState(18);
  const [finalAmount, setFinalAmount] = useState(0);
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const rate = 0.04; // 4% annual return
    const finalValue = investment * Math.pow(1 + rate, years);
    setFinalAmount(Number(finalValue.toFixed(2)));
    setGrowth(Number((finalValue - investment).toFixed(2)));
  }, [investment, years]);

  return (
    <section className="bg-[#f8fafc] py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">
            Calcola la{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 bg-clip-text text-transparent">
              Crescita
            </span>{' '}
            del Regalo
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Scopri come può crescere il tuo regalo nel tempo grazie
            all'interesse composto.
          </p>
        </div>
        <div className="flex flex-col items-stretch justify-center gap-12 lg:flex-row">
          {/* Sliders */}
          <div className="mx-auto flex max-w-xl flex-1 flex-col justify-center gap-10">
            <div>
              <div className="mb-2 flex justify-between">
                <label className="font-medium text-gray-700">
                  Importo del regalo
                </label>
                <span className="font-semibold">
                  {formatCurrency(investment)}
                </span>
              </div>
              <Slider
                value={[investment]}
                min={50}
                max={1000}
                step={10}
                onValueChange={([v]) => setInvestment(v)}
                className="my-4 h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400"
                thumbClassName="w-7 h-7 border-4 border-white bg-blue-500 shadow-lg focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>€50</span>
                <span>€1000</span>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <label className="font-medium text-gray-700">
                  Anni di crescita
                </label>
                <span className="font-semibold">{years} anni</span>
              </div>
              <Slider
                value={[years]}
                min={1}
                max={25}
                step={1}
                onValueChange={([v]) => setYears(v)}
                className="my-4 h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400"
                thumbClassName="w-7 h-7 border-4 border-white bg-green-400 shadow-lg focus:ring-2 focus:ring-green-400"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>1 anno</span>
                <span>25 anni</span>
              </div>
            </div>
            <div className="mt-2 text-sm italic text-gray-400">
              * Calcolo basato su un rendimento medio del 4% annuo. Gli
              investimenti comportano rischi e i rendimenti passati non sono
              garanzia di risultati futuri.
            </div>
          </div>
          {/* Card risultato */}
          <div className="flex flex-1 items-center justify-center">
            <Card className="w-full max-w-md rounded-3xl border border-blue-100 bg-white/80 p-0 shadow-xl backdrop-blur-md">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <BarChart3 className="text-blue-500" size={26} />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Risultato simulazione
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Investimento iniziale
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {formatCurrency(investment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Valore dopo {years} anni
                    </p>
                    <p className="text-3xl font-bold text-green-500">
                      {formatCurrency(finalAmount)}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-base text-green-500">
                      <TrendingUp size={20} />
                      <span>
                        +{formatCurrency(growth)} (
                        {((growth / investment) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="mt-6 w-full rounded-full bg-blue-600 text-lg font-semibold shadow-md hover:bg-blue-700"
                  >
                    <Link href="/auth/register">Crea Regalo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
