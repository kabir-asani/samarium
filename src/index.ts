import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prismaClient } from "./prisma";

const hono = new Hono();

hono.get("/countries", async (context) => {
  const countries = await prismaClient.country.findMany();

  return context.json(
    {
      countries,
    },
    200
  );
});

hono.post("/countries", async (context) => {
  const { name, countryCode } = await context.req.json();

  const country = await prismaClient.country.create({
    data: {
      name,
      countryCode,
    },
  });

  return context.json(
    {
      country,
    },
    201
  );
});

hono.patch("/countries/:countryCode", async (context) => {
  const { countryCode } = context.req.param();
  const { name } = await context.req.json();

  const country = await prismaClient.country.update({
    where: {
      countryCode,
    },
    data: {
      name,
    },
  });

  return context.json(
    {
      country,
    },
    200
  );
});

hono.delete("/countries/:countryCode", async (context) => {
  const { countryCode } = context.req.param();

  const existingCountry = await prismaClient.country.findUnique({
    where: {
      countryCode,
    },
  });

  if (existingCountry) {
    await prismaClient.country.delete({
      where: {
        countryCode,
      },
    });

    return context.json(
      {
        country: existingCountry,
      },
      200
    );
  } else {
    return context.notFound();
  }
});

serve(hono, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
