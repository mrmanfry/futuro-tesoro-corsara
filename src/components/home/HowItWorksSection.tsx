import { Gift, Users, Landmark, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: <Gift className="h-8 w-8 text-blue-100" />,
    title: 'Crea una raccolta',
    description:
      'Inserisci nome e occasione (battesimo, comunione, compleanno...) e personalizza la tua raccolta.',
  },
  {
    icon: <Users className="h-8 w-8 text-blue-100" />,
    title: 'Condividi il link',
    description:
      "Invita amici e parenti: ognuno può contribuire con l'importo che preferisce.",
  },
  {
    icon: <Landmark className="h-8 w-8 text-blue-100" />,
    title: 'Trasforma la raccolta in investimento',
    description:
      "Scopri chi ha contribuito e investi in modo sicuro l'importo raccolto con il nostro partner regolamentato.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-blue-100" />,
    title: "Segui l'evoluzione",
    description:
      "Quando vuoi monitora l'andamento. Con il tempo, l'interesse composto fa la differenza.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="come-funziona" className="w-full bg-[#2a3e8c] px-2 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 md:flex-row">
        {/* Colonna sinistra: step */}
        <div className="flex-1 text-white">
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">Come Funziona</h2>
          <p className="mb-10 text-lg text-blue-100">
            Il futuro inizia con 4 semplici passaggi
          </p>
          <div className="flex flex-col gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-5">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  {step.icon}
                </div>
                <div>
                  <h3 className="mb-1 text-xl font-bold">{step.title}</h3>
                  <p className="text-base leading-relaxed text-blue-100">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Colonna destra: card raccolta */}
        <div className="flex w-full flex-1 justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-blue-900">
                  Raccolta per il battesimo di Sofia
                </div>
                <div className="text-sm text-gray-500">
                  Creata da Marco e Laura
                </div>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                Aperta
              </span>
            </div>
            <div className="mb-4 mt-4 divide-y divide-gray-100">
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-blue-900">
                    Nonna Elena e Nonno Stefano
                  </div>
                  <div className="text-sm text-gray-400">
                    "Per il tuo futuro, con amore, i nonni"
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-700">€300</div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-blue-900">Zio Paolo</div>
                  <div className="text-sm text-gray-400">
                    "Un piccolo contributo per grandi sogni"
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-700">€100</div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-blue-900">
                    Famiglia Bianchi
                  </div>
                  <div className="text-sm text-gray-400">
                    "Auguri piccola Sofia!"
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-700">€150</div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-lg font-bold text-blue-900">
                Totale raccolto
              </div>
              <div className="text-2xl font-bold text-teal-500">€550</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
