import type { Metadata } from "next";
import {
  WhatsAppHero,
  VideoSection,
  Conversations,
  Dashboard,
  Guarantee,
} from "@/components/whatsapp/WhatsAppExperience";
export const metadata: Metadata = {
  title: "Votre agent WhatsApp",
  description:
    "Un agent WhatsApp qui répond à vos clients, qualifie vos prospects et centralise les échanges dans votre CRM.",
};
export default function WhatsAppPage() {
  return (
    <>
      <WhatsAppHero />
      <VideoSection src={process.env.NEXT_PUBLIC_WHATSAPP_VIDEO_URL} />
      <Conversations />
      <Dashboard />
      <Guarantee />
    </>
  );
}
