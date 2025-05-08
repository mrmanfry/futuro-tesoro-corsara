import { TrendingUp, Shield, Clock, GraduationCap } from 'lucide-react';

const features = [
  {
    icon: <TrendingUp className="h-7 w-7 text-blue-400" />, // soft blue
    iconBg: 'bg-blue-100/60',
    title: 'Crescita a lungo termine',
    description:
      "L'importo raccolto viene investito con l'obiettivo di farlo crescere nel tempo.",
  },
  {
    icon: <Shield className="h-7 w-7 text-green-400" />, // soft green
    iconBg: 'bg-green-100/60',
    title: 'Sicuro e regolamentato',
    description:
      'Tutti gli investimenti sono gestiti da un partner regolamentato che rispetta la normativa italiana.',
  },
  {
    icon: <Clock className="h-7 w-7 text-yellow-400" />, // soft gold
    iconBg: 'bg-yellow-100/60',
    title: 'Semplice e veloce',
    description:
      'Crea un regalo in pochi minuti e condividilo facilmente con amici e parenti.',
  },
  {
    icon: <GraduationCap className="h-7 w-7 text-indigo-400" />, // soft navy
    iconBg: 'bg-indigo-100/60',
    title: 'Educativo per il bambino',
    description:
      "Insegna il valore del risparmio e dell'investimento fin da piccoli, in modo concreto e positivo.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center md:text-left">
          <h2 className="mb-2 text-3xl font-bold md:text-4xl">
            Perché Scegliere{' '}
            <span className="bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 bg-clip-text text-transparent">
              Futuro Tesoro
            </span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-lg text-gray-500 md:mx-0">
            Un gesto oggi, per un regalo che cresce nel futuro.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-start rounded-2xl border border-gray-100 bg-white/80 p-8 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-2xl"
              style={{ minHeight: 260 }}
            >
              <div
                className={`${feature.iconBg} mb-6 flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-105`}
              >
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-blue-900 transition-colors group-hover:text-blue-600">
                {feature.title}
              </h3>
              <p className="text-base leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
