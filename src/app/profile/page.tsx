"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWallet } from '@/hooks/useWallet';
import WalletStatus from '@/components/wallet/WalletStatus';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { walletData, loading: walletLoading, error: walletError } = useWallet();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/profile/get")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data.profile);
          setFullName(data.profile?.full_name || "");
          setAvatarUrl(data.profile?.avatar_url || "");
        });
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    let uploadedAvatarUrl = avatarUrl;
    // Upload avatar se cambiato
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      const res = await fetch("/api/profile/upload-avatar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) uploadedAvatarUrl = data.url;
    }
    // Update profilo
    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, avatar_url: uploadedAvatarUrl }),
    });
    if (res.ok) {
      toast.success("Profilo aggiornato!");
      setAvatarFile(null);
    } else {
      toast.error("Errore durante il salvataggio");
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Le password non coincidono");
      return;
    }
    setChangingPassword(true);
    const res = await fetch("/api/profile/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    if (res.ok) {
      toast.success("Password aggiornata!");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error("Errore durante il cambio password");
    }
    setChangingPassword(false);
  };

  if (!user || !profile) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Wallet Status Section */}
        {walletLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : walletError ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">{walletError}</div>
        ) : (
          <WalletStatus
            walletStatus={walletData.walletStatus}
            walletSetupDeadline={walletData.walletSetupDeadline}
            escrowAmount={walletData.escrowAmount}
            availableAmount={walletData.availableAmount}
          />
        )}
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Il tuo profilo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback>{fullName?.[0]}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={handleAvatarChange}
              />
              <Label htmlFor="avatar-upload" className="cursor-pointer text-blue-600 hover:underline">
                Cambia avatar
              </Label>
            </div>
            <div>
              <Label>Nome completo</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
            <div>
              <Label>Registrato il</Label>
              <Input value={profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"} disabled />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>
              Salva
            </Button>
            <Button variant="outline" className="w-full" onClick={signOut}>
              Logout
            </Button>
            <div className="pt-4 border-t">
              <Label>Cambia password</Label>
              <Input
                type="password"
                placeholder="Nuova password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="mt-2"
              />
              <Input
                type="password"
                placeholder="Conferma password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="mt-2"
              />
              <Button className="mt-2 w-full" onClick={handleChangePassword} disabled={changingPassword}>
                Cambia password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 