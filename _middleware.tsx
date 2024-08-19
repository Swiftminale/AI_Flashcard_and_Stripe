import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  const cookie = req.cookies["auth"];

  if (!cookie) {
    return NextResponse.redirect("/login");
  }
};