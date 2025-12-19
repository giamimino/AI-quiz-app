export default async function EasyFetch({
  url,
  data,
}: {
  url: string;
  data?: Object;
}) {
  try {
    const res = await fetch(url, {
      ...(data
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        : {}),
    });
    const jsonRes = await res.json();

    return jsonRes;
  } catch (error) {
    console.error(error);
  }
}
