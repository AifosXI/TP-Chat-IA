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
                temperature: 0.75,
                top_p: 1,
                max_new_tokens: 500,
                repetition_penalty: 1,
                system_prompt: "You are a helpful, respectful and honest assistant who translate messages between users, if there is a single word, try to give the closest translation and in one word. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\\n\\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information."
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