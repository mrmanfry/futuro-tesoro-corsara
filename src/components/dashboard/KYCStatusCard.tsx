"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

type KYCStatus = "light_required" | "full_required" | "verified" | "rejected" | "unknown"

interface KYCStatusCardProps {
  className?: string
}

export function KYCStatusCard({ className }: KYCStatusCardProps) {
  const router = useRouter()
  const [status, setStatus] = useState<KYCStatus>("unknown")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        const response = await fetch("/api/mangopay/kyc")
        const data = await response.json()
        setStatus(data.status)
      } catch (error) {
        console.error("Error fetching KYC status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchKYCStatus()
  }, [])

  const statusConfig = {
    light_required: {
      icon: AlertCircle,
      title: "Attiva il Wallet",
      description: "Per attivare il wallet e ricevere fondi, completa la verifica base dell'identità (Light KYC).",
      buttonText: "Completa Light KYC",
      buttonVariant: "default" as const,
    },
    full_required: {
      icon: AlertCircle,
      title: "Verifica Identità Avanzata Richiesta",
      description: "Hai raggiunto la soglia massima consentita. Per continuare a ricevere fondi, completa la verifica avanzata dell'identità (Full KYC).",
      buttonText: "Completa Full KYC",
      buttonVariant: "default" as const,
    },
    rejected: {
      icon: AlertCircle,
      title: "Verifica Fallita",
      description: "La verifica della tua identità non è andata a buon fine. Controlla i dati inseriti e riprova.",
      buttonText: "Riprova Verifica",
      buttonVariant: "destructive" as const,
    },
    verified: {
      icon: CheckCircle2,
      title: "Identità Verificata",
      description: "La tua identità è stata verificata con successo. Puoi utilizzare tutte le funzionalità della piattaforma.",
      buttonText: "Visualizza Dettagli",
      buttonVariant: "outline" as const,
    },
    unknown: {
      icon: AlertCircle,
      title: "Stato KYC sconosciuto",
      description: "Non è stato possibile determinare lo stato della verifica. Contatta il supporto.",
      buttonText: "Contatta supporto",
      buttonVariant: "secondary" as const,
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.unknown

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Caricamento...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (status !== 'light_required' && status !== 'full_required' && status !== 'rejected') {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <config.icon className="h-5 w-5" />
          <CardTitle>{config.title}</CardTitle>
        </div>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant={config.buttonVariant}
          onClick={() => router.push("/wallet/kyc")}
          className="w-full"
        >
          {config.buttonText}
        </Button>
      </CardContent>
    </Card>
  )
} 