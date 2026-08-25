import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const themes = [
  {
    name: "Christmas",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660919/christ_dqutfi.png",
  },
  {
    name: "Halloween",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660915/hallow_xrmpfj.png",
  },
  {
    name: "Golf",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660914/olf_yu0cp8.png",
  },
  {
    name: "Tennis",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660914/tessnis_iosxhl.png",
  },
  {
    name: "Pickleball",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660913/pickleball_pmc0tm.png",
  },
  {
    name: "Baseball",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660911/base_gf2q89.png",
  },
  {
    name: "Fishing",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660910/fishing_itw638.png",
  },
  {
    name: "Cycling",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660910/cycling_nwpwvy.png",
  },
  {
    name: "Cool Grandpa",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660910/cool_vbdnrr.png",
  },
  {
    name: "Tech Geek",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660910/tech_x9j5qj.png",
  },
  {
    name: "Handyman",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660910/handy_qax1wk.png",
  },
  {
    name: "Motorcycle",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660910/motor_mp11ja.png",
  },
  {
    name: "Grill Meister",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660910/griull_a7o9ct.png",
  },
  {
    name: "Superdad",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660909/suprt_xfwrq4.png",
  },
  {
    name: "Travel",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1787660909/travel_rabbxs.png",
  },
];
async function seedThemes() {
  for (const { name, thumbnail } of themes) {
    const existingTheme = await prisma.theme.findFirst({
      where: { name },
    });

    if (!existingTheme) {
      await prisma.theme.create({
        data: {
          name,
          thumbnail,
          status: "ACTIVE",
        },
      });
    }
  }

  console.log("Themes seeded successfully");
}

seedThemes()
  .catch((error) => {
    console.error("Theme seeder failed:", error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });