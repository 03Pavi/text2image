import axios from "axios";
import { responseCodes } from "@/shared/constants/response-code";
import getErrorResponse from "@/shared/lib/get-error-response";
import { NextResponse } from "next/server";

const POLLINATION_URL = process.env.POLLINATION_URL!;

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt');

    if (!prompt) {
        return NextResponse.json(
            {
                status: false,
                message: "Prompt parameter is required."
            },
            {
                status: 400,
            }
        );
    }

    try {
        const url = `${POLLINATION_URL}/prompt/${prompt}`;
        const res = await axios.get(url, { responseType: 'arraybuffer' });

        const buffer = Buffer.from(res.data);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "image/jpeg",
                "Cache-Control": "public, max-age=86400"
            },
        });
    } catch (err) {
        console.error('Error generating image:', err);  // Log the error for debugging
        return getErrorResponse(responseCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", null);
    }
};
