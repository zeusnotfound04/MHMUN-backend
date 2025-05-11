import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
export {default} from "next-auth/middleware"


export async function middleware(req:NextRequest) {

  try {
    const token = await getToken({req , secret : process.env.NEXTAUTH_SECRET})
   console.log("Middleware Token :::: " , token)
    const registerRouteRegex = /^\/register(\/|$)/;
    const participantsRouteRegex = /^\/participants$/;
    const participantDetailRouteRegex = /^\/participants\/[^/]+$/;



    if (registerRouteRegex.test(req.nextUrl.pathname)) {
       if (!token || token.role!== "ADMIN") {
        return NextResponse.redirect( new URL("/" , req.url))
      }
    }


    if (participantsRouteRegex.test(req.nextUrl.pathname)) {
      if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    if (participantDetailRouteRegex.test(req.nextUrl.pathname)) {
       if (!token || token.role!== "ADMIN") {
        return NextResponse.redirect( new URL("/" , req.url))
      }
    }

    return NextResponse.next();

  } catch (error) {
    console.error("Middleware Error :::: ", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
  
}



export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], 
};