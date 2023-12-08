import {NextResponse} from "next/server";

async function handler(request, {params}, res) {
    const response = await fetch(
        "https://api.replicate.com/v1/predictions/" + params.id,
        {
            method: "GET",
            headers: {
                Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (response.status !== 200) {
        let error = await response.json();
        return NextResponse.json({response: error.detail, status: 500 });
    }

    const prediction = await response.json();

    return NextResponse.json({response: prediction});
}

export { handler as GET};