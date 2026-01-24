import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../turbin3-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

(async () => {
    const tx = createNft(umi,
        { mint, 
         name: "Genz Rug", 
        symbol: "GRUG", 
        uri: "https://gateway.irys.xyz/EapsDBsmdUKSzPjcgDq9Q4icnDKfMzxfr3RtDevrKL6m",
        sellerFeeBasisPoints: percentAmount(5)
        }
    );
     const result = await tx.sendAndConfirm(umi);
     const signature = base58.encode(result.signature);
    
     console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();