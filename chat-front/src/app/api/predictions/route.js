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
            version: "914692bbe8a8e2b91a4e44203e70d170c9c5ccc1359b283c84b0ec8d47819a46",

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