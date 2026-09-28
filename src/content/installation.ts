import type { BrandSlug } from "@/config/site";

export type InstallStep = { title: string; body: string; tip?: string };
export type InstallGuide = {
  brand: BrandSlug;
  title: string;
  intro: string;
  duration: string;
  videoId?: string;
  kit: string[];
  steps: InstallStep[];
  troubleshooting: { problem: string; fix: string }[];
};

const commonKit = ["HYDRA glass", "Alignment frame", "Wet wipe", "Microfiber cloth", "Dust-removal sticker", "Squeegee card"];

const commonTroubleshooting = [
  { problem: "Small bubbles remain", fix: "Push them to the nearest edge with the squeegee card. Tiny bubbles caused by moisture disappear within 24 hours." },
  { problem: "A dust particle is trapped", fix: "Lift the nearest corner with the dust sticker, dab the particle away with another sticker, and lay the glass back down." },
  { problem: "Touch feels less responsive", fix: "Enable ‘Touch sensitivity’ / ‘Screen protector mode’ in display settings and restart your phone." },
];

export const installationGuides: Record<BrandSlug, InstallGuide> = {
  iphone: {
    brand: "iphone",
    title: "Install on iPhone",
    intro: "HYDRA's alignment frame snaps onto your iPhone so the glass lands perfectly around the Dynamic Island every time.",
    duration: "2 minutes",
    kit: commonKit,
    steps: [
      { title: "Prepare a dust-free space", body: "Work in a bathroom after running a hot shower for a minute — steam pulls dust out of the air.", tip: "Remove your case before starting." },
      { title: "Clean the screen", body: "Wipe with the wet wipe, then polish dry with the microfiber cloth until there are no streaks." },
      { title: "Remove remaining dust", body: "Dab the screen with the dust-removal sticker, paying extra attention to edges and the Dynamic Island area." },
      { title: "Attach the alignment frame", body: "Slide your iPhone into the frame, screen up. The frame's cut-out matches the camera module for a snug fit." },
      { title: "Place the glass", body: "Peel the backing film (label 1), hold the glass by its edges and drop it into the frame. Press the centre — adhesion spreads automatically." },
      { title: "Finish and cure", body: "Remove the top film (label 2), squeeze any bubbles outwards and leave the phone face-up for 30 minutes before adding your case." },
    ],
    troubleshooting: commonTroubleshooting,
  },
  samsung: {
    brand: "samsung",
    title: "Install on Samsung Galaxy",
    intro: "Our Galaxy kit is designed around the ultrasonic fingerprint sensor, with a UV-free adhesive that keeps it working flawlessly.",
    duration: "3 minutes",
    kit: commonKit,
    steps: [
      { title: "Delete saved fingerprints", body: "Go to Settings → Security → Fingerprints and remove existing prints. You'll re-register after install." },
      { title: "Clean the screen", body: "Wipe with the wet wipe and polish with the microfiber cloth, especially the curved edges." },
      { title: "Remove remaining dust", body: "Use the dust-removal sticker across the whole display and the punch-hole camera area." },
      { title: "Seat the alignment frame", body: "Place your Galaxy into the frame, pressing gently so the side buttons line up with the notches." },
      { title: "Place the glass", body: "Peel film 1, drop the glass into the frame and press firmly in the centre, then over the fingerprint area for 10 seconds." },
      { title: "Enable touch sensitivity and re-register", body: "Turn on Settings → Display → Touch sensitivity, then add your fingerprint again — press firmly and cover the full sensor." },
    ],
    troubleshooting: [
      ...commonTroubleshooting,
      { problem: "Fingerprint isn't recognized", fix: "Delete and re-register your fingerprint with the glass installed. Register the same finger twice for best results." },
    ],
  },
};
