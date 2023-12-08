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
            version: body.version ?? "13c3cdee13ee059ab779f0291d29054dab00a47dad8261375654de5540165fb0",

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