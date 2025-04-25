import { responseCodes } from "@/shared/constants/response-code";
import getErrorResponse from "@/shared/lib/get-error-response";
import { paraphraseText } from "@/shared/lib/rewrite";
import { NextResponse } from "next/server"

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') ?? "";

    if (!text) {
        return NextResponse.json(
            {
                status: false,
                message: "text parameter is required."
            },
            {
                status: 400,
            }
        );
    }

    try {
        const normalResponse = {
            id: 1,
            text: text
        };

        const fourResponse = await Promise.all(
            [2, 3, 4, 5].map(async (id) => ({
                id: id,
                text: await paraphraseText(text),  // Awaiting the paraphraseText asynchronously
            }))
        );

        return new NextResponse(
            JSON.stringify({ normalResponse, fourResponse }),
            {
                status: 200,
            }
        );
    } catch (err) {
        console.error('Error generating text:', err);
        return getErrorResponse(responseCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", null);
    }
};
