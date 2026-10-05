export type InstallStep = {
  title: string;
  body: string;
  tip?: string;
  /** Optional still — /public path or Cloudflare R2 URL */
  image?: string;
  /** Optional YouTube or direct mp4/webm for this step */
  video?: string;
};

export type InstallTrouble = { problem: string; fix: string };

/** Single shared install guide (iPhone + Galaxy use the same kit & flow). */
export type InstallationContent = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  duration: string;
  /** YouTube URL / watch ID, or direct mp4/webm (e.g. R2 public URL) */
  videoUrl: string;
  kit: string[];
  steps: InstallStep[];
  troubleshooting: InstallTrouble[];
  brandsNote: string;
};

export const defaultInstallationContent: InstallationContent = {
  eyebrow: "Installation",
  title: "Perfect fit,",
  titleAccent: "first try.",
  intro:
    "One alignment-frame kit. One clean-room ritual. The same bubble-free install whether you wear iPhone or Galaxy — watch the guide, then follow each step.",
  duration: "2–3 minutes",
  videoUrl: "",
  brandsNote: "Same process for Apple & Samsung",
  kit: [
    "HYDRA glass",
    "Alignment frame",
    "Wet wipe",
    "Microfiber cloth",
    "Dust-removal sticker",
    "Squeegee card",
  ],
  steps: [
    {
      title: "Prepare a dust-free space",
      body: "Work on a clean table — or in a bathroom after a short hot shower so steam pulls dust out of the air. Remove your case before you start.",
      tip: "Wash hands and dry them fully. Finger oils make adhesion harder.",
      image: "/products/box.jpg",
    },
    {
      title: "Clean the screen",
      body: "Wipe with the wet wipe, then polish dry with the microfiber cloth until the display has no streaks, fingerprints, or residue.",
      tip: "Pay extra attention to edges and the camera / Dynamic Island or punch-hole area.",
      image: "/products/glass-clear.jpg",
    },
    {
      title: "Lift remaining dust",
      body: "Dab the entire screen with the dust-removal sticker. Any particle left under the glass will show as a bubble or speck.",
      image: "/products/glass-matte.jpg",
    },
    {
      title: "Seat the alignment frame",
      body: "Slide the phone into the frame, screen up, until it sits snug. The cut-outs match cameras and buttons so the glass drops in square.",
      tip: "If the frame feels loose, reseat it — a true fit is what keeps edges perfect.",
      image: "/products/case-clear.jpg",
    },
    {
      title: "Place the glass",
      body: "Peel backing film (label 1), hold the glass by its edges, and lower it into the frame. Press the centre firmly — adhesive spreads outward on its own.",
      tip: "Galaxy ultrasonic fingerprint: press over the sensor for ~10 seconds after the glass lands.",
      image: "/products/glass-privacy.jpg",
    },
    {
      title: "Finish and cure",
      body: "Remove the top film (label 2). Sweep any tiny bubbles to the nearest edge with the squeegee. Leave the phone face-up for 30 minutes before reattaching your case.",
      tip: "Galaxy: turn on Display → Touch sensitivity, then re-register your fingerprint with the glass on.",
      image: "/products/camera-lens.jpg",
    },
  ],
  troubleshooting: [
    {
      problem: "Small bubbles remain",
      fix: "Push them to the nearest edge with the squeegee. Tiny moisture bubbles usually vanish within 24 hours.",
    },
    {
      problem: "A dust particle is trapped",
      fix: "Lift the nearest corner with a dust sticker, dab the particle away, and lay the glass back down slowly.",
    },
    {
      problem: "Touch feels less responsive",
      fix: "Enable Touch sensitivity / Screen protector mode in display settings, then restart the phone.",
    },
    {
      problem: "Galaxy fingerprint isn't recognized",
      fix: "Delete saved prints and re-register with the glass installed. Register the same finger twice for best results.",
    },
  ],
};

/** @deprecated Brand-split guides removed — use defaultInstallationContent / CMS. */
export const installationGuides = {
  iphone: defaultInstallationContent,
  samsung: defaultInstallationContent,
};
