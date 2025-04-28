import { fal } from "@fal-ai/client";
import { responseCodes } from "@/shared/constants/response-code";
import getErrorResponse from "@/shared/lib/get-error-response";
import { NextResponse } from "next/server";

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
        const result = await fal.subscribe("fal-ai/minimax-image", {
            input: {
                prompt: prompt
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    update.logs.map((log) => log.message).forEach(console.log);
                }
            },
        });

        // Check if images are returned in result.data
        if (result.data?.images && result.data.images.length > 0) {
            const imageUrl = result.data.images[0]; // Assuming the first image is what you need

            return NextResponse.json(
                {
                    status: true,
                    message: "Image generated successfully.",
                    imageUrl: imageUrl
                },
                {
                    status: 200
                }
            );
        } else {
            return NextResponse.json(
                {
                    status: false,
                    message: "Image generation failed, no images returned."
                },
                {
                    status: 500
                }
            );
        }
    } catch (err) {
        console.error('Error generating image:', err); 
        return getErrorResponse(responseCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", err);
    }
};
