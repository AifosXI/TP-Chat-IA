import {NextResponse} from "next/server";

async function handler(request, res) {

    const body = await request.json();

    const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            version: "02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",

            input: {
                prompt: body.prompt,
            },
        }),
    });

    if (response.status !== 201) {
        let error = await response.json();
        return NextResponse.json({response: error.title, status: response.status });
    }

    const prediction = await response.json();

    return NextResponse.json({response: prediction, status: 201 });
}

export { handler as POST };