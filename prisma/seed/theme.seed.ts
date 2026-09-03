import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const themes = [
  {
    name: "Christmas",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435301/christ_hxb7j9.png",
  },
  {
    name: "Halloween",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435301/hallowen_rt9sjv.png",
  },
  {
    name: "Golf",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435303/golf_zqq2li.png",
  },
  {
    name: "Tennis",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435302/tennis_xitols.png",
  },
  {
    name: "Pickleball",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435302/pickleball_r2aglp.png",
  },
  {
    name: "Baseball",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435302/baseball_cq5xbb.png",
  },
  {
    name: "Fishing",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435302/fishing_yypias.png",
  },
  {
    name: "Cycling",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435302/cycling_od2sgb.png",
  },
  {
    name: "Cool Grandpa",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435302/cool_rcuy6t.png",
  },
  {
    name: "Tech Geek",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435302/tech_kssb7o.png",
  },
  {
    name: "Handyman",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435301/handyman_q3pwiu.png",
  },
  {
    name: "Motorcycle",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435301/motorcycle_btmd1p.png",
  },
  {
    name: "Grill Meister",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435301/grill_meister_bv9ycg.png",
  },
  {
    name: "Superdad",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435300/superDad_uyjl8k.png",
  },
  {
    name: "Travel",
    thumbnail: "https://res.cloudinary.com/djghn6egw/image/upload/v1788435301/travel_gxz6n3.png",
  },
];
async function seedThemes() {
  for (const { name, thumbnail } of themes) {
    const existingTheme = await prisma.theme.findFirst({
      where: { name },
    });

    if (existingTheme) {
      await prisma.theme.update({
        where: {
          theme_id: existingTheme.theme_id,
        },
        data: {
          thumbnail,
          status: "ACTIVE",
        },
      });
    } else {
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