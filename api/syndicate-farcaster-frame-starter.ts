// Two very important environment variables to set that you MUST set in Vercel:
// - SYNDICATE_FRAME_API_KEY: The API key that you received for frame.syndicate.io.
// DM @Will on Farcaster/@WillPapper on Twitter to get an API key.
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function (req: VercelRequest, res: VercelResponse) {
  // Farcaster Frames will send a POST request to this endpoint when the user
  // clicks the button. If we receive a POST request, we can assume that we're
  // responding to a Farcaster Frame button click.
  if (req.method == "POST") {
    try {
      console.log("Received POST request from Farcaster Frame button click");
      console.log("Farcaster Frame request body:", req.body);
      console.log("Farcaster Frame trusted data:", req.body.trustedData);
      console.log(
        "Farcaster Frame trusted data messageBytes:",
        req.body.trustedData.messageBytes
      );

      // Once your contract is registered, you can mint an NFT using the following code
      const syndicateRes = await fetch("https://frame.syndicate.io/api/mint", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + process.env.SYNDICATE_FRAME_API_KEY,
        },
        body: JSON.stringify({
          frameTrustedData: req.body.trustedData.messageBytes,
        }),
      });

      console.log("Syndicate response:", syndicateRes);
      console.log("Sending confirmation as Farcaster Frame response");

      res.status(200).setHeader("Content-Type", "text/html").send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <meta property="og:title" content="You've minted your commemorative NFT for Syndicate's FramedNouns API!" />
            <meta
              property="og:image"
              content="https://bafkreifpsy4bihrgavched3dtdawei3xm4ab7sjbdgj6pve5nekypse2yy.ipfs.nftstorage.link"
            />
            <meta property="fc:frame" content="vNext" />
            <meta
              property="fc:frame:image"
              content="https://bafkreifpsy4bihrgavched3dtdawei3xm4ab7sjbdgj6pve5nekypse2yy.ipfs.nftstorage.link"
            />
            <meta
              property="fc:frame:button:1"
              content="You Just got Glizzied, Bruh!!"
            />
          </head>
        </html>
      `);
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`);
    }
  } else {
    // If the request is not a POST, we know that we're not dealing with a
    // Farcaster Frame button click. Therefore, we should send the Farcaster Frame
    // content
    res.status(200).setHeader("Content-Type", "text/html").send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta property="og:title" content="Mint your commemorative NFT for the launch of Syndicate's Framed Nouns API!" />
        <meta
          property="og:image"
          content="https://bafkreifpsy4bihrgavched3dtdawei3xm4ab7sjbdgj6pve5nekypse2yy.ipfs.nftstorage.link"
        />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://bafkreifpsy4bihrgavched3dtdawei3xm4ab7sjbdgj6pve5nekypse2yy.ipfs.nftstorage.link"
        />
        <meta property="fc:frame:button:1" content="Mint your commemorative Framed Noun NFT!" />
        <meta
          name="fc:frame:post_url"
          content="https://framed-nouns.vercel.app/api/syndicate-farcaster-frame-starter"
        />
      </head>
    </html>
    `);
  }
}
