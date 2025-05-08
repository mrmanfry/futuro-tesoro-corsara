import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Come funziona esattamente Futuro Tesoro?',
    answer:
      "Futuro Tesoro ti permette di creare un fondo d'investimento a nome di un bambino. Tu o altri familiari potete contribuire al fondo, che viene investito in ETF diversificati e a basso costo. Il capitale cresce nel tempo grazie all'interesse composto fino a quando il bambino non raggiunge la maggiore età.",
  },
  {
    question: 'Chi gestisce effettivamente i soldi investiti?',
    answer:
      "I fondi vengono gestiti da ETFmatic, un partner finanziario regolamentato che opera in conformità con le normative europee. Futuro Tesoro si occupa dell'esperienza utente, mentre ETFmatic gestisce il lato tecnico degli investimenti, garantendo sicurezza e conformità normativa.",
  },
  {
    question: 'Quali sono i costi del servizio?',
    answer:
      "Applichiamo una piccola fee di servizio che varia in base all'importo investito: €3 fino a €100, €4,50 per €101-250, €6 per €251-500, e €7 oltre €500. Questa fee viene prelevata solo al momento dell'investimento, non durante la raccolta. Inoltre, c'è una commissione di gestione annuale dello 0,15% sugli asset under management.",
  },
  {
    question:
      'Posso prelevare i soldi prima che il bambino raggiunga la maggiore età?',
    answer:
      "In situazioni eccezionali, è possibile richiedere un prelievo anticipato. Tuttavia, il servizio è progettato per investimenti a lungo termine, e per massimizzare i benefici dell'interesse composto è consigliabile mantenere l'investimento fino alla maggiore età del bambino.",
  },
  {
    question: 'Cosa succede quando il bambino compie 18 anni?',
    answer:
      "Quando il bambino raggiunge la maggiore età, riceve l'accesso al fondo e può decidere se prelevare il capitale accumulato o continuare a investirlo. In quel momento, verrà anche fornito materiale educativo per aiutarlo a comprendere l'importanza del risparmio e dell'investimento.",
  },
  {
    question: 'È sicuro investire con Futuro Tesoro?',
    answer:
      'Sì, tutti gli investimenti sono gestiti da partner regolamentati che rispettano le normative italiane ed europee. I fondi dei clienti sono segregati e non vengono mai utilizzati per le operazioni aziendali. Inoltre, operiamo con la massima trasparenza riguardo ai costi e alle operazioni.',
  },
];

const FAQSection = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Domande <span className="text-blue-800">Frequenti</span>
          </h2>
          <p className="text-lg text-gray-600">
            Tutto quello che c'è da sapere su Futuro Tesoro e sui nostri
            servizi.
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200"
              >
                <AccordionTrigger className="py-4 text-left font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
